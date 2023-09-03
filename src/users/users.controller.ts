import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ConflictException,
  NotFoundException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserExistsGuard } from './guards/user-exists.guard';
import { AdminGuard } from '../shared/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(UserExistsGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role === 'admin') {
      throw new ForbiddenException('Cannot register as an admin');
    }

    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new ConflictException('Username already exists');
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(AdminGuard)
  @Get('/find/:username')
  async findByUsername(@Param('username') username: string) {
    const foundUser = await this.usersService.findByUsername(username);

    if (foundUser) {
      return { foundUser };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AdminGuard)
  @Patch('update/:username')
  async updateRole(@Param('username') username: string, @Req() req) {
    const role = req.body.role;
    return this.usersService.updateRole(username, role);
  }
}
