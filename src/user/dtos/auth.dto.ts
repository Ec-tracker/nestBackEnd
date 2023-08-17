import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: '请输入用户名' })
  readonly name: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;
}

export class LoginDTO {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: '请输入用户名' })
  readonly name: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;

  sessionId?: string;
}

export class UserInfoDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  readonly password: string;

  salt?: string;
}
