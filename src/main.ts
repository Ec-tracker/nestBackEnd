import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';
import { RemoveSensitiveUserInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RemoveSensitiveUserInfoInterceptor());

  // 创建文档
  generateDocument(app);

  await app.listen(3000);
}
bootstrap();
