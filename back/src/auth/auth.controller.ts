import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() dto: AdminLoginDto) {
    // Pas de création de compte ici : juste une connexion selon ta règle
    return this.authService.validateAdmin(dto.email, dto.password);
  }
}
