import { CreateContentDto } from '../dtos/content.dto';
import { ContentSerive } from './../services/content.service';
import { Content } from '../entities/content.mongo.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';

@ApiTags('内容')
@Controller('api/web/content')
export class ContentController {
  constructor(private readonly ContentService: ContentSerive) {}

  @ApiOperation({
    summary: '新增/更新内容',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  @HttpCode(200)
  async create(@Body() dto: CreateContentDto, @Req() req) {
    const userId = req.user.id;
    dto.userId = userId;
    const content = await this.ContentService.create(dto);

    return content;
  }

  @ApiOperation({
    summary: '查找所有内容',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateContentDto]),
  })
  @Get('list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() query: PaginationParamsDto, @Req() req) {
    const userId = req.user.id;
    const { pageSize, page } = query;
    const { data, count } = await this.ContentService.findAll({
      ...query,
      userId,
    });

    return {
      content: data,
      pageSize,
      pageNo: 1,
    };
  }

  @ApiOperation({
    summary: '查找单个内容',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get('get')
  async findOne(@Query() query) {
    const { id } = query;
    return await this.ContentService.findOne(id);
  }

  @ApiOperation({
    summary: '删除单个内容',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  @HttpCode(200)
  remove(@Body() dto) {
    const { id } = dto;
    return this.ContentService.remove(id);
  }

  @ApiOperation({
    summary: '发布',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('publish')
  @HttpCode(200)
  publish(@Body() dto) {
    const { id } = dto;
    return this.ContentService.publish(id, true);
  }

  @ApiOperation({
    summary: '发布',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('unpublish')
  @HttpCode(200)
  unpublish(@Body() dto) {
    const { id } = dto;
    return this.ContentService.publish(id, false);
  }
}
