import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authToken = request.headers.authorization?.split(' ')[1];
    const cookieToken = request.cookies?.token;

    if (authToken) {
      try {
        const payload = await this._jwtService.verifyAsync(authToken, {
          secret: process.env.SECRET,
        });

        const userIsAdmin = await this._usersService.checkIfUserIsAdmin(
          payload.username,
        );
        return userIsAdmin;
      } catch (error) {
        return false;
      }
    } else if (cookieToken) {
      try {
        const payload = await this._jwtService.verifyAsync(cookieToken, {
          secret: process.env.SECRET,
        });

        const userIsAdmin = await this._usersService.checkIfUserIsAdmin(
          payload.username,
        );
        return userIsAdmin;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }
}
