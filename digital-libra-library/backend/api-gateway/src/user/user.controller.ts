import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registration(@Body() user: UserDTO) {
    return this.userService.registration(user);
  }

  @Post("login")
  async login(@Body() user: UserDTO) {
    return this.userService.login(user);
  }
}
