import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('api/register')
  async registerUser(@Body() createUserDto: {email: string, password: string, confirmPassword: string}) {
    try {
      return await this.appService.registerUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('api/login')
  async loginUser(@Body() credentials: { email: string; password: string }) {
    try {
      return await this.appService.loginUser(credentials);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
