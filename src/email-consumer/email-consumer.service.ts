import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MailProviderService } from '../mail-provider/mail-provider.service';
import { SendEmailDto } from './dto/send-email.dto';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailConsumerService {
  private readonly logger = new Logger(EmailConsumerService.name);

  constructor(private readonly mailProvider: MailProviderService) {}

  async processEmailDelivery(
    payload: SendEmailDto,
  ): Promise<{ success: boolean }> {
    this.logger.log(
      `Processing email job to: ${payload.to}. Template: ${payload.template || 'none'}`,
    );

    let finalHtml = payload.html;

    if (payload.template) {
      finalHtml = this.renderTemplate(payload.template, payload.context || {});
    }

    await this.mailProvider.sendMail({
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: finalHtml,
    });

    return { success: true };
  }

  private renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    try {
      const templatePath = path.join(
        __dirname,
        'templates',
        `${templateName}.hbs`,
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at path: ${templatePath}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf8');

      const compiledTemplate = Handlebars.compile(templateSource);

      return compiledTemplate(context);
    } catch (error) {
      this.logger.error(
        `Error rendering template "${templateName}"`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to render template: ${error.message}`,
      );
    }
  }
}
