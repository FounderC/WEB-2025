import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ReadingProgressDTO } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ReadingProgressService {
  constructor(@Inject('READING_SERVICE') private readonly readingClient: ClientProxy) {}

  private async send(pattern: any, data: any): Promise<any> {
    return firstValueFrom(
      this.readingClient.send(pattern, data).pipe(
        timeout(30000),
        catchError((e: any) => {
          if (e.statusCode && e.message) {
            throw new HttpException(e.message, e.statusCode);
          }

          throw new HttpException('Internal server error', 500);
        }),
      ),
    );
  }

  async create(dto: ReadingProgressDTO) {
    return this.send("create", dto);
  }

  async findOne(id: string) {
    return this.send("findOne", id);
  }

  async update(id: string, dto: ReadingProgressDTO) {
    return this.send("update", {id, dto})
  }
}
