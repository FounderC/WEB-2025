import { Injectable, Logger, Inject, HttpException } from '@nestjs/common';
import { UserDTO } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  private async send(pattern: any, data: any): Promise<any> {
    return firstValueFrom(
      this.userClient.send(pattern, data).pipe(
        timeout(30000),
        catchError((e: any) => {
          if (e?.message && e?.status) {
            throw new HttpException(e.message, e.status);
          }

          throw new HttpException('Internal server error', 500);
        }),
      ),
    );
  }

  registration(dto: UserDTO) {
    return this.send('create', dto);
  }

  login(dto: { email: string; password: string }) {
    return this.send('login', dto);
  }
}