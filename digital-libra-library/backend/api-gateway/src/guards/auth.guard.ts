import {
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const user = await firstValueFrom(
        this.userClient.send("verify", { token })
      );

      if (!user) {
        return false;
      }

      request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
