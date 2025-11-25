import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  async getAllUsers() {
    return this.userRepository.find({
      relations: ['role'], 
      order: { id: 'DESC' } 
    });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }
}