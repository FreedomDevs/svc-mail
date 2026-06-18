import { Module } from '@nestjs/common';
import { MailProviderService } from './mail-provider.service';

@Module({
  providers: [MailProviderService],
  exports: [MailProviderService],
})
export class MailProviderModule {}
