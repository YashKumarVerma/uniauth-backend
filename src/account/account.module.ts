import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ApplicationModule } from 'src/application/application.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { accessTokenJwtConstants } from './constants/access_token.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: accessTokenJwtConstants.secret,
      signOptions: { expiresIn: accessTokenJwtConstants.expiresIn },
    }),
    ApplicationModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
