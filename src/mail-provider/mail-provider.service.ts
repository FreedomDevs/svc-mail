import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IMailOptions } from './interfaces/mail-options.interface';

@Injectable()
export class MailProviderService {
  private readonly logger = new Logger(MailProviderService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com');
    const portRaw = this.configService.get<string>('MAIL_PORT', '465');
    const port = parseInt(portRaw, 10);
    const secure =
      this.configService.get<string>('MAIL_SECURE', 'true') === 'true';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: this.configService.get<string>('MAIL_USER') ?? '',
        pass: this.configService.get<string>('MAIL_PASS') ?? '',
      },
    });
  }

  async sendMail(options: IMailOptions): Promise<void> {
    try {
      const from =
        this.configService.get<string>('MAIL_FROM') ??
        'elysiumsmp.team@gmail.com';

      await this.transporter.sendMail({
        from,
        ...options,
      });
      this.logger.log(`Email successfully sent to ${options.to}`);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to send email to ${options.to}`, error.stack);
      throw error;
    }
  }
}
