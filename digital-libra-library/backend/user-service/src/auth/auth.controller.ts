import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
// Import the types
import { Tokens, TokenPayload } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("tokens")
  async generateTokens(dto): Promise<Tokens> {
    return this.authService.generateTokens(dto);
  }

  @MessagePattern("verify")
  async verifyToken(dto): Promise<TokenPayload> {
    return this.authService.verifyAccessToken(dto.token);
  }

  @MessagePattern("refresh")
  async refreshTokens(dto): Promise<Tokens> {
    return this.authService.refreshTokens(dto);
  }
}