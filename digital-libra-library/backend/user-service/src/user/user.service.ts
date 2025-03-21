import { Injectable, UnauthorizedException, Logger, HttpException, HttpStatus, ForbiddenException, ConflictException } from '@nestjs/common';
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

    if (this.findByEmail(dto.email) !== null){
      return { message: 'Test', status: HttpStatus.BAD_REQUEST }; 
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
    let user = await this.findByEmail(dto.email);

    if (!user) {
      return { message: 'Test', status: HttpStatus.UNAUTHORIZED }; 
    }

    let isPasswordValid = await bcrypt.compare(dto.password, user.password);;

    if (!isPasswordValid) {
      return { message: 'Test', status: HttpStatus.UNAUTHORIZED }; 
    }

    return this.authService.generateTokens({
      member_id: user.id,
      role_id: user.role
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
