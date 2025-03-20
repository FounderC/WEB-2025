import { Injectable, Logger, Inject } from '@nestjs/common';
import { UserDTO } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private send(pattern: any, data: any): Promise<any> {
    const res$ = this.userClient.send(pattern, data).pipe(
      timeout(30000),
      catchError((e: Error) => {
        this.logger.error(e);
        return throwError(() => e);
      }),
    );

    return firstValueFrom(res$);
  }
  
  registrationUser(dto: UserDTO) {
    return this.send("create", dto);
  }

  loginUser(dto: { email: string; password: string; }) {
    return this.send("login", dto);
  }
}
 