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
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res) {
    const user = req.user;
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this._authService.generateToken(user);
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
