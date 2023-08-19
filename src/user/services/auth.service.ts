import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import { encryptPassword, makeSalt } from 'src/shared/utils/cryptogram.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerByName(registerDTO: RegisterDTO) {
    this.checkRegisterForm(registerDTO);
    const { name, password } = registerDTO;

    const { salt, hasPassword } = this.getPassword(password);
    const newUser: User = new User();
    newUser.name = name;
    newUser.password = hasPassword;
    newUser.salt = salt;

    const savedUser = await this.userRepository.save(newUser);
    console.log(savedUser);

    return savedUser;
  }

  async checkRegisterForm(dto: RegisterDTO) {
    const { name } = dto;

    const hasUser = await this.userRepository.findOneBy({
      name,
    });

    if (hasUser) {
      throw new BadRequestException('用户已经存在');
    }
  }

  getPassword(password) {
    const salt = makeSalt();
    const hasPassword = encryptPassword(password, salt);

    return { salt, hasPassword };
  }

  async login(login: LoginDTO) {
    const user = await this.checkLoginForm(login);

    const token = await this.certificate(user);

    return {
      ...user,
      seesionId: `Bearer ${token}`,
    };
  }

  async certificate(user: User) {
    const payload = {
      id: user._id,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async checkLoginForm(dto: LoginDTO) {
    const { name, password } = dto;
    const user = await this.userRepository.findOneBy({
      name,
    });

    if (!user) {
      throw new InternalServerErrorException('用户不存在');
    }

    const { password: dbPassword, salt } = user;
    const currentPassword = encryptPassword(password, salt);

    if (currentPassword !== dbPassword) {
      throw new InternalServerErrorException('密码错误');
    }

    return user;
  }

  async info(id: string) {
    const user = await this.userRepository.findOneBy(id);

    return Object.assign({}, user);
  }
}
