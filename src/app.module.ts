import * as config from 'config';

/**
 * This is the entry-point of the project, and all modules are summoned here.
 * When adding new functionality, if it does not fall under any of the already
 * defined modules, then new module would be integrated here.
 * @packageDocumentation
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { mongooseConfig } from './config/mongoose.config';

/**
 * Main Application Module
 * @category Module
 */
@Module({
  imports: [MongooseModule.forRoot(config.get('database.string'), mongooseConfig), UserModule],
})
export class AppModule {}
