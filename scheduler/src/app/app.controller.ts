import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WithId } from 'mongodb';
import { AppService } from './app.service';
import { ScheduleEvent } from '@nx-fornida/interface/tasks';

@Controller('cron')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('run')
	run(@Body() body: WithId<ScheduleEvent>) {
		return this.appService.runJob(body);
	}

	@Post('run/:id')
	runCronId(@Param('id') id: string) {
		return this.appService.runJob(id);
	}

	@Post('refresh')
	refresh() {
		return this.appService.updateAll();
	}

	@Post('refresh/:id')
	refreshOne(@Body() body: WithId<ScheduleEvent>) {
		return this.appService.update(body);
	}
}
