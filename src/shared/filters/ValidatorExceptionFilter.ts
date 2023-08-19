import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExcetptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log('customFilter', exception);

    // const status = exception.getStatus ? exception.getStatus() : 500;
    // const msg = exception.message ? exception.message : 'Internal Sever Error';

    response.status(200).json({
      msg: 'validator Error',
    });
  }
}
