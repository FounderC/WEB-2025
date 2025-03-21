import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookService } from './book.service';
import { BookDTO } from './dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('create')
  create(@Payload() book: BookDTO) {
    return this.bookService.create(book);
  }

  @MessagePattern('findAll')
  findAll() {
    return this.bookService.findAll();
  }

  @MessagePattern('findOne')
  findOne(@Payload() id: string) {
    return this.bookService.findOne(id);
  }

  @MessagePattern('update')
  update(@Payload() id: string, book: BookDTO) {
    return this.bookService.update(id, book);
  }
}
