import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [PlanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
