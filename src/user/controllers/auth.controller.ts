import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseFilters,
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
import { ValidationExcetptionFilter } from 'src/shared/filters/ValidatorExceptionFilter';
import { throwError } from 'rxjs';

@ApiTags('认证鉴权')
@Controller('api')
@UseFilters(ValidationExcetptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '注册',
  })
  @HttpCode(200)
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<any> {
    return this.authService.registerByName(registerDTO);
  }

  @ApiOperation({
    summary: '登录',
  })
  @HttpCode(200)
  @Post('Login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @ApiOperation({
    summary: '用户登出',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(200)
  @Post('LoginOut')
  async loginOut(): Promise<any> {}

  @ApiOperation({
    summary: '用户当前信息',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async info(@Req() req: any): Promise<any> {
    const data = await this.authService.info(req.user.id);
    return { data };
  }
}
