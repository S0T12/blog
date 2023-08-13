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
    const authToken = this.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken);
      return { username: payload.username, id: payload.sub };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getAuthTokenFromCookie(cookie: string) {
    const cookies = cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('token='),
    );
    const authToken = tokenCookie.split('=')[1];

    return authToken;
  }
}
