import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Get('/privacy/:id')
  findUsersPrivacyInfo(@Param('id') id: string) {
    return this.userService.getUserPrivacyInfo(id);
  }

  // @Put(':id')
  // async update(
  //   @Param('id') userId: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   return this.userService.update(userId, updateUserDto);
  // }

  @Delete(':id')
  async remove(@Param('id') userId: UserEntity['id']): Promise<void> {
    await this.userService.remove(userId);
  }
}
