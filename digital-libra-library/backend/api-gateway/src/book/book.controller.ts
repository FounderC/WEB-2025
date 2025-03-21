import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDTO } from './dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles("admin")
  async create(@Body() book: BookDTO) {
    return this.bookService.create(book);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() book: BookDTO) {
    return this.bookService.update(id, book);
  }
}
