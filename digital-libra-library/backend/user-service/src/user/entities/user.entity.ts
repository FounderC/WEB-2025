import {
    Entity,
    Column,
    PrimaryGeneratedColumn
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;

    @Column()
    role: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  }