import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this._userService.findByUsername(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: SigninDto) {
    const validate = await this.validateUser(user.username, user.password);

    if (!validate) {
      return new UnauthorizedException('username or password incorrect');
    }
    const payload = { username: validate.username, sub: validate.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  getAuthTokenFromCookie(cookie: string) {
    const cookies = cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('token='),
    );
    const authToken = tokenCookie.split('=')[1];

    return authToken;
  }
}
