import * as mongooseUniquevalidator from 'mongoose-unique-validator';

import { Module, forwardRef } from '@nestjs/common';

import { DashboardModule } from 'src/dashboard/dashboard.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => DashboardModule),
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseUniquevalidator);
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
