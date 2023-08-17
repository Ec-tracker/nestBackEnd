import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { RegisterDTO } from '../dtos/auth.dto';
import { encryptPassword, makeSalt } from 'src/shared/utils/cryptogram.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>,
  ) {}

  async registerByName(registerDTO: RegisterDTO) {
    this.checkRegisterForm(registerDTO);
    const { name, password } = registerDTO;

    const { salt, hasPassword } = this.getPassword(password);
    const newUser: User = new User();
    newUser.name = name;
    newUser.password = hasPassword;
    newUser.salt = salt;

    return await this.userRepository.save(newUser);
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
}
