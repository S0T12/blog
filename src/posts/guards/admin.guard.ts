import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly _usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { author } = request.body;

    const userIsAdmin = await this._usersService.checkIfUserIsAdmin(author);
    return userIsAdmin;
  }
}
