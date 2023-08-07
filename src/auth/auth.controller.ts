import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signIn.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post()
  signIn(@Body() signInDto: SigninDto) {
    return this._authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
