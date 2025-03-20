import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserDTO } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create')
  create(dto: UserDTO) {
    return this.userService.create(dto);
  }

  @MessagePattern('login')
  login(dto: { email: string; password: string }) {
    return this.userService.login(dto);
  }
}
