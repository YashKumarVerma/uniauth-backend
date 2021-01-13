import { BadGatewayException, BadRequestException, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';

import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(error: any) {
    if (error.name === 'ValidationError') {
      const errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      throw new BadRequestException(errors);
    }
  }
}
