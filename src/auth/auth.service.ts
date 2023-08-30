import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signIn.dto';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this._userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: SigninDto) {
    const validate = await this.validateUser(user.username, user.password);

    if (!validate) {
      throw new UnauthorizedException('Username or password incorrect');
    }

    const token = this.generateToken(validate);
    return {
      token,
    };
  }

  generateToken(user: UserEntity): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
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
