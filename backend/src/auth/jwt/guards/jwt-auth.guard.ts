import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const jwtValue = super.canActivate(context);
      const isValidToken =
        typeof jwtValue === 'boolean' || jwtValue instanceof Promise
          ? jwtValue instanceof Promise
            ? jwtValue.then((it) => it)
            : jwtValue
          : lastValueFrom(jwtValue).then((it) => it);
      return isValidToken;
    } catch (error) {
      return false;
    }
  }
}
