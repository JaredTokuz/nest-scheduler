import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, Interval, SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { CronJob, CronJobParameters, time } from 'cron';
import { clientNameToId } from '@nx-fornida/backend/core-functions';
import { AxiosRequestConfig } from 'axios';
import { Task, ScheduleEvent, TaskEditorPayload, RequestMethods } from '@nx-fornida/interface/tasks';
import { EVENT_COLLECTION } from './constants/injectables';
import { Collection, WithId } from 'mongodb';
import { writeFileSync } from 'fs';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

export interface ScheduleEventTask extends ScheduleEvent {
	tasks: Task[];
}

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);
	crons: {
		[name: string]: {
			name: string;
			modified: number;
			/** used to delete old crons during runtime */
			lastUpdateAllFlag?: number;
		};
	} = {};
	private readonly backend: string;

	constructor(
		private httpService: HttpService,
		private schedulerRegistry: SchedulerRegistry,
		@Inject(EVENT_COLLECTION)
		private events: Collection<ScheduleEvent>
	) {
		this.backend = process.env.backend || 'http://localhost:3333';
		this.init();
	}

	/**
	 * Only run once on server start
	 * creates all the cron jobs based on the mongo collection config
	 */
	private init() {
		this.getScheduledEvents()
			.then((events) => {
				this.logger.debug(`init events => Total: ${events.length}`);
				events.forEach((event) => {
					this.addCronJob(event);
				});
			})
			.then(() => {
				this.checkCrons();
			})
			.finally(() => {
				this.logger.debug('init events created cron jobs complete');
			});
	}

	private getScheduledEvents() {
		return this.events
			.aggregate<WithId<ScheduleEventTask>>([
				{
					$lookup: {
						from: 'tasks',
						localField: 'processCategoryId',
						foreignField: 'processCategoryId',
						as: 'tasks'
					}
				}
			])
			.toArray();
	}

	/** updates individual event's schedule without restarting the server */
	update(event: WithId<ScheduleEvent>) {
		const job = this.schedulerRegistry.getCronJob(event._id.toString());
		job.setTime(time(event.cron));
		job.start();
		this.crons[event._id.toString()].modified = event.meta.modified;
		this.logger.debug('job updated', event._id);
	}

	/**
	 * Checks the mongo collection for new/modified or deleted events and updates the cron jobs accordingly
	 * for updating cron jobs without restarting the server
	 */
	updateAll() {
		this.getScheduledEvents()
			.then((events) => {
				/** get current jobs */
				const jobs = this.schedulerRegistry.getCronJobs();
				const updateAllFlag = new Date().getUTCMilliseconds();
				events.forEach((event) => {
					this.crons[event._id.toString()].lastUpdateAllFlag = updateAllFlag;

					if (jobs.has(event._id.toString())) {
						/** check if the cron job is up to date */
						/** check if the modified at time of creation is different from the latest query */
						if (this.crons[event._id.toString()].modified !== event.meta.modified) {
							/** update the cron job/state */
							this.update(event);
						}
					} else {
						/** add the cron job */
						this.addCronJob(event);
					}
				});

				/** after looping thru check for any existing crons that didn't updateAllFlag */
				Object.values(this.crons).forEach((cron) => {
					/** checks if the last update was older then the current update flag */
					if (cron.lastUpdateAllFlag < updateAllFlag) {
						/** it seems to be deleted from the mongo collection since last update */
						this.schedulerRegistry.deleteCronJob(cron.name);
					}
				});
			})
			.finally(() => {
				this.logger.debug('updateAll events complete');
			});
	}

	/**
	 * adds a new cron job to the scheduler registry
	 * @param scheduleEvent schedule event
	 */
	addCronJob(scheduleEvent: WithId<ScheduleEventTask>) {
		if (scheduleEvent.tasks[0]) {
			if (!scheduleEvent.tasks[0].path || !scheduleEvent.tasks[0].requestMethod) {
				this.logger.warn(`no tasks found or key information missing for event ${scheduleEvent._id}`);
				return;
			}
		} else {
			this.logger.warn(`no tasks found for event ${scheduleEvent._id}`);
			return;
		}

		const cronOptions: CronJobParameters = {
			cronTime: scheduleEvent.cron,
			onTick: () => {
				this.httpRequest(scheduleEvent);
			},
			start: true,
			utcOffset: -6 /** utc -6 us central tz no matter the server */
		};
		const job = new CronJob(cronOptions);

		this.schedulerRegistry.addCronJob(scheduleEvent._id.toString(), job);
		this.crons[scheduleEvent._id.toString()] = {
			name: scheduleEvent._id.toString(),
			modified: scheduleEvent.meta.modified
		};
	}

	/**
	 *  Creates a html file that displays this data
	 * a scheduled logger function that prints summary data to the console
	 * use this for any high level logging
	 */
	@Cron(CronExpression.EVERY_30_MINUTES, {
		name: 'checkCrons'
	})
	checkCrons() {
		const jobs = this.schedulerRegistry.getCronJobs();
		let view_str = '<ul>\n';
		jobs.forEach((value, key, map) => {
			let next;
			try {
				next = value.nextDates(2);
				if (next.length) {
					next = next.map((date) => date.toDate()).join(' => ');
				}
				view_str += `<li>${key} => Next run: ${next}</li>\n`;
			} catch (e) {
				next = 'error: next fire date is in the past!';
				view_str += `<li>${key} => ${next}</li>\n`;
			}
			this.logger.debug(`job: ${key} -> next: ${next}`);
		});
		view_str += '</ul>\n';
		writeFileSync(__dirname + '/assets/views/index.html', view_str);
	}

	/**
	 * delete a cron job from the scheduler registry
	 * @param event schedule event
	 */
	deleteCron(event: WithId<ScheduleEvent>) {
		this.schedulerRegistry.deleteCronJob(event._id.toString());
		this.logger.warn(`job ${event._id} deleted!`);
	}

	/**
	 * manually fire of cron job
	 * @param event pass either a schedule event or a cron job name; cron name can be
	 * hard since it is mongo _id except for declarative jobs
	 */
	runJob(event: WithId<ScheduleEvent> | string) {
		let job;
		if (typeof event === 'string') {
			job = this.schedulerRegistry.getCronJob(event);
		} else {
			job = this.schedulerRegistry.getCronJob(event._id.toString());
		}
		job.fireOnTick();
	}

	/**
	 *
	 * @param payload
	 */
	httpRequest(scheduleEvent: WithId<ScheduleEventTask>) {
		const url = `${this.backend}/api/${clientNameToId(scheduleEvent.clientId)}/${scheduleEvent.tasks[0].path}`;
		this.logger.debug('url', url);
		const config: AxiosRequestConfig = {
			method: scheduleEvent.tasks[0].requestMethod,
			url: url,
			headers: {
				'Content-Type': 'application/json',
				cronjwt: 'cron'
			},
			data: scheduleEvent.query
		};
		// this.httpService.request(config).subscribe(this.logger.log);
		this.httpService
			.request(config)
			.pipe(
				timeout({
					each: 5000,
					with: () => of('Waiting')
				})
			)
			.subscribe({
				next: (response) => {
					this.logger.log('next', response);
				},
				error: (error) => {
					this.logger.log(error);
				},
				complete: () => {
					/** standardized process on complete maybe useless */
					this.logger.log('complete');
				}
			});
	}
}
