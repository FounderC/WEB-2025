import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
  
@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;

    @Column()
    author: string;
  
    @Column()
    genre: string;

    @Column()
    description: string;

    @Column()
    publication_year: number;
  
    @Column()
    file_url: string;

    @Column()
    cover_url: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}