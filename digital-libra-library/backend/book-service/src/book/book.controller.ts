import { Body, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookService } from './book.service';
import { BookDTO } from './dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('create')
  create(dto: BookDTO) {
    return this.bookService.create(dto);
  }

  @MessagePattern('findAll')
  findAll() {
    return this.bookService.findAll();
  }

  @MessagePattern('findOne')
  findOne(@Payload('id') id: string) {
    return this.bookService.findOne(id);
  }

  @MessagePattern('update')
  update(@Payload('id') id: string, dto: BookDTO) {
    return this.bookService.update(id, dto);
  }
}
