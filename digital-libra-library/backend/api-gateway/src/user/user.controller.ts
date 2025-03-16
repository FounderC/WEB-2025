import { Controller, Post, Body, Logger} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registrationUser(@Body() user: UserDTO) {
    this.logger.log('Registration user');
    return this.userService.registrationUser(user);
  }

  @Post("login")
  async loginUser(@Body() user: UserDTO) {
    this.logger.log('Login user');
    return this.userService.loginUser(user);
  }
}
