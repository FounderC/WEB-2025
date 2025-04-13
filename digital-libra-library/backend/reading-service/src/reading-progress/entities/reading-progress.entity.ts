import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reading_progress')
export class ReadingProgress {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'uuid' })
    book_id: string;
  
    @Column()
    current_page: number;

    @Column()
    percentage_read: number;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}