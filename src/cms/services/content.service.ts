import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Content } from '../entities/content.mongo.entity';
import { CreateContentDto } from '../dtos/content.dto';
import { join } from 'path';
import * as puppeteer from 'puppeteer';
import { ensureDir, outputFile } from 'fs-extra';

@Injectable()
export class ContentSerive {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private contentRepository: MongoRepository<Content>,
  ) {}

  async create(dto: CreateContentDto) {
    const has =
      dto.id !== null &&
      (await this.contentRepository.findOneBy({ id: dto.id }));
    let ret;
    if (!has) {
      // 判断是否存在
      dto.publish = false;
      const count = await this.contentRepository.count();
      dto.id = count + 1;
      dto['isDelete'] = false;
      // 异步生成缩略图
      dto.thumbnail = await this.takeScreenshot(dto.id);
      ret = await this.contentRepository.save(dto);
    } else {
      // 异步生成缩略图
      dto.thumbnail = await this.takeScreenshot(dto.id);
      ret = await this.contentRepository.updateOne(
        { id: dto.id },
        { $set: dto },
      );
    }

    return dto;
  }

  async findAll({
    pageSize,
    page,
    userId,
  }): Promise<{ data: Content[]; count: number }> {
    const [data, count] = await this.contentRepository.findAndCount({
      where: {
        userId,
        isDelete: false,
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });

    return {
      data,
      count,
    };
  }

  async findAllTemplate({
    pageSize,
    page,
    userId,
  }): Promise<{ data: Content[]; count: number }> {
    const [data, count] = await this.contentRepository.findAndCount({
      where: {
        isDelete: false,
        type: 'template',
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });

    return {
      data,
      count,
    };
  }

  async findOne(id: string) {
    const ret = await this.contentRepository.findOneBy({
      id: parseInt(id),
      isDelete: false,
    });
    return ret;
  }

  async update(id: string, dto: CreateContentDto) {
    const ret = await this.contentRepository.update(id, dto);
    return ret;
  }

  async publish(id: string, isPublish: boolean) {
    const ret = await this.contentRepository.updateOne(
      {
        id: parseInt(id),
      },
      {
        $set: { publish: isPublish },
      },
    );
    return ret;
  }

  async remove(id: string) {
    return await this.contentRepository.updateOne(
      { id: parseInt(id) },
      { $set: { isDelete: true } },
    );
  }

  /**
   * 截取缩略图
   * @param url
   * @param id
   */
  async takeScreenshot(id) {
    const url = `http://builder.codebus.tech/?id=${id}`;
    const host = 'http://template.codebus.tech/';
    const prefix = `static/upload/`;
    const imgPath = join(__dirname, '../../../..', prefix);
    await ensureDir(imgPath);
    const thumbnailFilename = `thumb_header_${id}.png`;
    const thumbnailFullFilename = `thumb_full_${id}.png`;
    this.runPuppeteer(url, {
      thumbnailFilename: join(imgPath, thumbnailFilename),
      thumbnailFullFilename: join(imgPath, thumbnailFullFilename),
    });

    return {
      header: host + prefix + thumbnailFilename,
      full: host + prefix + thumbnailFullFilename,
    };
  }

  async runPuppeteer(url, { thumbnailFilename, thumbnailFullFilename }) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--lang=zh-CN'],
      headless: true,
    });
    const page = await browser.newPage();

    // 设置打开分辨率
    await page.setViewport({ width: 750, height: 800 });

    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: thumbnailFilename,
    });

    await page.screenshot({
      fullPage: true, // 是否截全屏
      path: thumbnailFullFilename,
    });
    console.log('缩略图生成完成。。。。');
    await browser.close();
  }
}
