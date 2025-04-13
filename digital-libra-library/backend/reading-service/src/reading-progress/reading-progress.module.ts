import { Module } from '@nestjs/common';
import { ReadingProgress } from './entities/reading-progress.entity';
import { ReadingProgressController } from './reading-progress.controller';
import { ReadingProgressService } from './reading-progress.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingProgress])],
  controllers: [ReadingProgressController],
  providers: [ReadingProgressService],
})
export class ReadingProgressModule {}
