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
    return { message: 'Book successfully added', book };
  }

  async findAll() {
    const books = await this.bookRepository.find({});
    return { message: 'Books retrieved successfully', books };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new RpcException({ statusCode: 404, message:'Book not found' })
    }

    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new RpcException({ statusCode: 404, message:'Book not found' })
    }

    return { message: 'Book retrieved successfully', book };
  }

  async update(id: string, dto: BookDTO) {
    const bookResult = await this.findOne(id);

    const book = Object.assign(bookResult.book, dto);
    const saved = await this.bookRepository.save(book);

    return { message: 'Book updated successfully', book: saved };
  }
}
