import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const rmqUrl = process.env.RMQ_URL || 'amqp://localhost:5672';
  const rmqQueue = process.env.RMQ_QUEUE || 'email_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen();
  console.log(`svc-mail is listening to RabbitMQ queue: "${rmqQueue}"`);
}
bootstrap();
