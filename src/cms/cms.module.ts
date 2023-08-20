import { Module } from '@nestjs/common';
import { ShareModule } from '../shared/shared.module';
import { CMSProviders } from './cms.provoders';
import { ContentController } from './controllers/content.controller';
import { TemplateController } from './controllers/template.controller';
import { ContentSerive } from './services/content.service';

@Module({
  controllers: [ContentController, TemplateController],
  providers: [ContentSerive, ...CMSProviders],
  imports: [ShareModule],
})
export class CMSModule {}
