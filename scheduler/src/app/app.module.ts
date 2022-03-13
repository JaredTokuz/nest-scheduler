import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		HttpModule,
		DatabaseModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, 'assets', 'views'),
			exclude: ['/api*']
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
