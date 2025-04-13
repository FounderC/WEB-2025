import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registration(@Body() dto: UserDTO) {
    return this.userService.registration(dto);
  }

  @Post("login")
  async login(@Body() dto: UserDTO) {
    return this.userService.login(dto);
  }
}
