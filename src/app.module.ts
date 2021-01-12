/**
 * This is the entry-point of the project, and all modules are summoned here.
 * When adding new functionality, if it does not fall under any of the already
 * defined modules, then new module would be integrated here.
 * @packageDocumentation
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { JudgeModule } from './judge/judge.module';
import { typeOrmConfig } from './config/typeorm.config';

/**
 * Main Application Module
 * @category Module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    JudgeModule,
  ],
})
