import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateContentDto {
  @ApiProperty({ example: 'ID' })
  id?: number;

  @ApiProperty({ example: '标题' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '{"title":"演示1"}"' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: false })
  publish?: boolean = false;

  @ApiProperty({ example: 'template' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '1' })
  userId?: ObjectId;

  @ApiProperty()
  thumbnail?: object;
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}
