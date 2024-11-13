import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Exception thrown when a Guild isn't found by ID
 */
export class GuildDoesNotExistException extends Error {
  constructor(guildId: string) {
    super(
      `Guild with the id ${guildId} does not exist or is not using Cardinal System.`,
    );
  }
}

/**
 * Filter used to produce the http response when the exception is thrown in a http context
 */
@Catch(GuildDoesNotExistException)
export class GuildDoesNotExistExceptionFilter implements ExceptionFilter {
  catch(exception: GuildDoesNotExistException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.statusMessage = exception.message;
    response.sendStatus(HttpStatus.FORBIDDEN);
  }
}
