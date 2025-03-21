import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookDTO } from './dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ){}

  async create(dto: BookDTO) {
    const book = this.bookRepository.create(dto);
    await this.bookRepository.save(book);
    return { message: 'Book added', status: HttpStatus.OK }; // 200 OK
  }

  async findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: string) {
    return this.bookRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: BookDTO) {
    await this.bookRepository.update(id, dto);  }
}
