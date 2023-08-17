import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ShareModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, ...UserProviders],
  imports: [ShareModule],
})
export class UserModule {}
