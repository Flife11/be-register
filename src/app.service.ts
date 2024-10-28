import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.model';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async registerUser(createUserDto: {email: string, password: string, confirmPassword: string}) {
    
    if (!this.isValidEmail(createUserDto.email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    const userExists = await this.checkUserExists(createUserDto.email);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hashedPassword;
    await this.saveUser({email: createUserDto.email, password: createUserDto.password});

    return { message: 'User registered successfully' };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  private async saveUser(userData: {email: string, password: string}): Promise<void> {
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
  }

  async loginUser(credentials: { email: string; password: string }) {    
    if (!this.isValidEmail(credentials.email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.findOne({ where: { email: credentials.email } });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'Login successful' };
  }
}
