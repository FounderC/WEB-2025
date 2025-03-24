import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, firstValueFrom, throwError } from 'rxjs';
import { BookDTO } from './dto';

@Injectable()
export class BookService {
  constructor(@Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy) {}

  private async send(pattern: any, data: any): Promise<any> {
    return firstValueFrom(
      this.bookClient.send(pattern, data).pipe(
        timeout(30000),
        catchError((e: HttpException) => {

          console.error('Microservice Error:', e); // Log the error to inspect it

          if (e instanceof HttpException) {
            // Handle HttpException
            throw new HttpException(e.message, e.getStatus());
          }

          throw new HttpException('Internal server error', 500);
        }),
      ),
    );
  }

  create(book: BookDTO) {
    return this.send('create', book);
  }

  findAll() {
    return this.send("findAll", {});
  }

  findOne(id: string) {
    return this.send("findOne", { id });
  }

  update(id: string, book: BookDTO) {
    return this.send("update", { id, book });
  }
}
