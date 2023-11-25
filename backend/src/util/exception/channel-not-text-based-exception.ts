import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
export class ChannelNotTextBasedException extends Error {
  constructor(channelName: string) {
    super(`Channel ${channelName} is not text based.`);
  }
}

@Catch(ChannelNotTextBasedException)
export class ChannelNotTextBasedExceptionFilter implements ExceptionFilter {
  catch(exception: ChannelNotTextBasedException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.statusMessage = exception.message;
    response.sendStatus(HttpStatus.BAD_REQUEST);
  }
}
