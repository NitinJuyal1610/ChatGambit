import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  async getUser(@Body() body: { userId: User['userId'] }): Promise<UserModel> {
    return await this.userService.getUserById(body.userId);
  }

  //   @Post('api/users')
  //   async modifyUser(@Body() body: { userId: User['userId'] }): Promise<void> {
  //     console.log('hye');
  //     return await this.userService.removeUserById(body.userId);
  //   }
}
