import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../auth/auth.service';

import { UserDTO } from './dto';
import { User } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private saltRounds = 10; 

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: UserDTO) {
    const userPassword = await bcrypt.hash(dto.password, this.saltRounds);

    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existingUser) {
      throw new RpcException({ statusCode: 400, message: 'Unable to process request' });
    }

    const $user = this.userRepository.create({
      ...dto,
      password: userPassword,
    });
  
    const user = await this.userRepository.save($user);

    return this.authService.generateTokens({
      member_id: user.id,
      role_id: user.role
    });
  }

  async login(dto: {email: string; password: string;}) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new RpcException({ statusCode: 401, message: 'Invalid credentials.' });
    }

    return this.authService.generateTokens({
      member_id: user.id,
      role_id: user.role
    });
  }
}
