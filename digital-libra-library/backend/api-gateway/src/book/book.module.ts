import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: 'BOOK_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'book-service',
            queueOptions: { durable: false },
          },
        }),
    },
  ],
})
export class BookModule {}