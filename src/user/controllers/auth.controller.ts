import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('认证鉴权')
@Controller('api')
export class AuthController {
  constructor() {}

  @ApiOperation({
    summary: '注册',
  })
  @HttpCode(200)
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<any> {}

  @ApiOperation({
    summary: '登录',
  })
  @HttpCode(200)
  @Post('Login')
  async login(@Body() loginDTO: LoginDTO): Promise<any> {}

  @ApiOperation({
    summary: '用户登出',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(200)
  @Post('Login')
  async loginOut(): Promise<any> {}

  @ApiOperation({
    summary: '用户当前信息',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async info(@Body() loginDTO: LoginDTO): Promise<any> {}
}
