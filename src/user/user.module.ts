import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ShareModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, ...UserProviders, AuthService, JwtStrategy],
  imports: [
    ShareModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ShareModule],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
  ],
})
export class UserModule {}
