import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../auth/auth.service';

import { UserDTO } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private saltRounds = 10; 

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: UserDTO) {
    this.logger.log(`Creating user: ${JSON.stringify(dto)}`);
    
    const userPassword = await bcrypt.hash(dto.password, this.saltRounds);

    const $user = this.userRepository.create({
      ...dto,
      password: userPassword,
    });
  
    const user = await this.userRepository.save($user);

    return this.authService.generateTokens({
      member_id: user.id
    });
  }

  async login(dto: {email: string; password: string;}) {
    let user = await this.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let isPasswordValid = await bcrypt.compare(dto.password, user.password);;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateTokens({
      member_id: user.id
    });
  }

  async update(id: string) {
    return await this.userRepository.findOne({where: { id }});
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findByName(username: string) {
    return await this.userRepository.findOne({where: { username }});
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
