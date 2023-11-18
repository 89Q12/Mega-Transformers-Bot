import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class SendDirectMessageToUserException extends Error {
  constructor(guildId: string, userId: string) {
    super(
      `Failed to send direct message to user ${userId} in guild ${guildId}.`,
    );
  }
}

@Catch(SendDirectMessageToUserException)
export class SendDirectMessageToUserExceptionFilter implements ExceptionFilter {
  catch(exception: SendDirectMessageToUserException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.statusMessage = exception.message;
    response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
