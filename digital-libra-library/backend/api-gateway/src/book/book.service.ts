import { Injectable, Inject, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, firstValueFrom, throwError } from 'rxjs';
import { BookDTO } from './dto';

@Injectable()
export class BookService {
  constructor(@Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy) {}

  private send(pattern: any, data: any): Promise<any> {
    const res$ = this.bookClient.send(pattern, data).pipe(
      timeout(30000),
      catchError((e: Error) => {
        return throwError(() => e);
      }),
    );

    return firstValueFrom(res$);
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
