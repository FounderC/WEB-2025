import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'user-service',
            queueOptions: { durable: false },
          },
        }),
    },
  ],
  exports: [UserService, 'USER_SERVICE'],
})
export class UserModule {}
