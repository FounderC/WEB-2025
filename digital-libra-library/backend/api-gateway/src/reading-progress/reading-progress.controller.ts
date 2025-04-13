import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ReadingProgressService } from './reading-progress.service';
import { ReadingProgressDTO } from './dto';

@Controller('reading-service')
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) {}

  @Post()
  create(@Body() dto: ReadingProgressDTO) {
    return this.readingProgressService.create(dto);
  }

  @Get(':userId')
  findOne(@Param('id') id: string) {
    return this.readingProgressService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ReadingProgressDTO) {
    return this.readingProgressService.update(id, dto);
  }
}
