import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { ReadingProgressController } from './reading-progress.controller';
import { ReadingProgressService } from './reading-progress.service';

@Module({
  controllers: [ReadingProgressController],
  providers: [
    ReadingProgressService,
    {
      provide: 'READING_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'reading-service',
            queueOptions: { durable: false },
          },
        }),
    },
  ],
})
export class ReadingProgressModule {}
