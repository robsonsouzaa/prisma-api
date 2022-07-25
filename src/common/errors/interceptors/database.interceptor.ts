import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { DatabaseError } from '../types/DatabaseError';
import { handleDatabaseErrors } from '../util/handle-database-error';
import { isPrimsError } from '../util/is-prisma-error-util';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (isPrimsError(error)) {
          error = handleDatabaseErrors(error);
        }

        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      })
    );
  }
}
