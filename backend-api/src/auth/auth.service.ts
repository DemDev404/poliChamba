// backend-api/src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

 async register(registerDto: RegisterAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const { roleId, ...restOfDto } = registerDto;

    const newUser = this.userRepository.create({
      ...restOfDto, 
      passwordHash: hashedPassword,
      role: { id: roleId },
    });

    const savedUser = await this.userRepository.save(newUser);
    const { passwordHash, ...result } = savedUser;
    return result; 
  }

  async login(loginDto: LoginAuthDto) {
    console.log('Intento de login para:', loginDto.email);
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'] 
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas (Usuario no encontrado)');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas (Password erróneo)');
    }
    const payload = {
      sub: user.id, 
      email: user.email,
      role: user.role.name,
    };

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.firstName,
        role: user.role.name
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}