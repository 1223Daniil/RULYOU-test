import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const resObj: any = exception.getResponse();
      message = Array.isArray(resObj['message'])
        ? resObj['message'].join('; ')
        : resObj['message'] || resObj.toString();
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resObj: any = exception.getResponse();
      message =
        typeof resObj === 'string'
          ? resObj
          : resObj['message'] || JSON.stringify(resObj);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response
      .status(status)
      .json({ success: false, result: { error: message } });
  }
}
