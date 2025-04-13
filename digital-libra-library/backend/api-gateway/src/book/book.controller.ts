import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDTO } from './dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @Post()
  async create(@Body() dto: BookDTO) {
    return this.bookService.create(dto);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: BookDTO) {
    return this.bookService.update(id, dto);
  }
}
