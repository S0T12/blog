import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res) {
    const user = await this._authService.login(req.user);
    if (user instanceof UnauthorizedException) {
      throw user;
    }
    const token = user.token;
    res.cookie('token', token);
    res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAuth(@Headers('cookie') cookie: string) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      return { username: payload.username, id: payload.sub };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get('logout')
  async logout(@Res() res) {
    res.clearCookie('token');
    res.redirect('/');
  }
}
