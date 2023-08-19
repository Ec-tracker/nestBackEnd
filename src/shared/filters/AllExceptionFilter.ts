import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('allEecption', exception);

    const status = exception.getStatus ? exception.getStatus() : 500;
    const msg = exception.message ? exception.message : 'Internal Sever Error';

    response.status(200).json({
      status,
      msg,
    });
  }
}
