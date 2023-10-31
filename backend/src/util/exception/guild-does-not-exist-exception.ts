import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class GuildDoesNotExistException extends Error {
  constructor(guildId: string) {
    super(
      `Guild with the id ${guildId} does not exist or is not using Cardinal System.`,
    );
  }
}

@Catch(GuildDoesNotExistException)
export class GuildDoesNotExistExceptionFilter implements ExceptionFilter {
  catch(exception: GuildDoesNotExistException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.statusMessage = exception.message;
    response.sendStatus(HttpStatus.FORBIDDEN);
  }
}
