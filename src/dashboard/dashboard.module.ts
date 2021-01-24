import { ApplicationModule } from 'src/application/application.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ApplicationModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
