import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReadingProgressService } from './reading-progress.service';
import { ReadingProgressDTO } from './dto';

@Controller()
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) {}

  @MessagePattern('create')
  async create(@Payload() dto: ReadingProgressDTO) {
    const result = await this.readingProgressService.create(dto);
    console.log('Returning response:', result); // 🛠 Логируем перед return
    return result;
  }

  @MessagePattern('findOne')
  findOne(@Payload() id: string) {
    return this.readingProgressService.findOne(id);
  }

  @MessagePattern('update')
  update(@Payload('id') id: string, @Payload() dto: ReadingProgressDTO) {
    return this.readingProgressService.update(id, dto);
  }
}
