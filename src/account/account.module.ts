import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ApplicationModule } from '../application/application.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { accessTokenJwtConstants } from './constants/access_token.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: accessTokenJwtConstants.secret,
      signOptions: { expiresIn: accessTokenJwtConstants.expiresIn },
    }),
    ApplicationModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
