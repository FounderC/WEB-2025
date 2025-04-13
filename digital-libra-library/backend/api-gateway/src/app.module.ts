import { BookModule } from './book/book.module';
import { Module } from '@nestjs/common';
import { ReadingProgressModule } from './reading-progress/reading-progress.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, BookModule, ReadingProgressModule]
})
export class AppModule {}
