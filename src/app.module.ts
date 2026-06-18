import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerModule } from './email-consumer/email-consumer.module';
import { MailProviderModule } from './mail-provider/mail-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailProviderModule,
    EmailConsumerModule,
  ],
})
export class AppModule {}
