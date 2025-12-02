import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Email already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}