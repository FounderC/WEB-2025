import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
  } from '@nestjs/common';
  import { firstValueFrom } from 'rxjs';
  import { Inject } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  
@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    constructor(
      @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      this.logger.log('Token: $(token)')

      if (!token) {
        return false;
      }
  
      try {
        const $user = await firstValueFrom(
          this.userClient.send("verify", { token }),
        );

        this.logger.log(`User from verify: ${JSON.stringify($user)}`); // Log user
  
        // Attach user to request for use in controllers
        request.user = $user;
        return true;
      } 
      catch (err) {
        this.logger.error(err);
        return false;
      }
    }
}
