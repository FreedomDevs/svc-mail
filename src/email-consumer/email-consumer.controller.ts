import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { EmailConsumerService } from './email-consumer.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller()
export class EmailConsumerController {
  constructor(private readonly emailConsumerService: EmailConsumerService) {}

  @MessagePattern('send_email')
  async handleSendEmail(
    @Payload() data: SendEmailDto,
    @Ctx() context: RmqContext,
  ) {
    return await this.emailConsumerService.processEmailDelivery(data);
  }
}
