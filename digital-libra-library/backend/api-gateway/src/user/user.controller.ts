import { Controller, Post, Get, Body, Logger, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registrationUser(@Body() user: UserDTO) {
    return this.userService.registrationUser(user);
  }

  @Post("login")
  async loginUser(@Body() user: { email: string; password: string } ) {
    return this.userService.loginUser(user);
  }
}
