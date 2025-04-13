import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { ReadingProgressDTO } from './dto';
import { ReadingProgress } from './entities/reading-progress.entity'
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ReadingProgressService {
  constructor(
    @InjectRepository(ReadingProgress)
    private readonly readingProgressRepository: Repository<ReadingProgress>,
  ){}

  async create(dto: ReadingProgressDTO) {
    if (!isUUID(dto.user_id) || !isUUID(dto.book_id)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid request' });
    }

    const progress = this.readingProgressRepository.create(dto);
    await this.readingProgressRepository.save(progress);
    return { message: 'Operation completed successfully', progress };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid request' });
    }

    const progress = await this.readingProgressRepository.findOne({ where: { id } });

    if (!progress) {
      throw new RpcException({ statusCode: 404, message: 'Not found' });
    }

    return { message: 'Operation completed successfully', progress };
  }

  async update(id: string, dto: ReadingProgressDTO) {
    const result = await this.findOne(id);
    const $result = { ...result.progress, ...dto };

    return { message: 'Operation completed successfully', readingProgress: await this.readingProgressRepository.save($result) };
  }
}
