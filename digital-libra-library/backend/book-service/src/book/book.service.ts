import { Injectable } from '@nestjs/common';
import { BookDTO } from './dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
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
    return { message: 'Operation completed successfully', book };
  }

  async findAll() {
    const books = await this.bookRepository.find({});
    return { message: 'Operation completed successfully', books };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new RpcException({ statusCode: 400, message:'Invalid request' })
    }

    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new RpcException({ statusCode: 404, message:'Not found' })
    }

    return { message: 'Operation completed successfully', book };
  }

  async update(id: string, dto: BookDTO) {
    const result = await this.findOne(id);
    const $result = { ...result.book, ...dto };
    
    return { message: 'Operation completed successfully', book: await this.bookRepository.save($result) };
  }
}
