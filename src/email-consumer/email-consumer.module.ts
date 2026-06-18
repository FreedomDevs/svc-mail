import { Module } from '@nestjs/common';
import { EmailConsumerController } from './email-consumer.controller';
import { EmailConsumerService } from './email-consumer.service';
import { MailProviderModule } from '../mail-provider/mail-provider.module';

@Module({
  imports: [MailProviderModule],
  controllers: [EmailConsumerController],
  providers: [EmailConsumerService],
})
export class EmailConsumerModule {}
