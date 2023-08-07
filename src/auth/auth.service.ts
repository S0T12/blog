import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this._userService.findByUsername(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return { access_token: await this._jwtService.signAsync(payload) };
  }
}
