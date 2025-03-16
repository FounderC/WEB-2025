import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
  });

  await app.listen(3000);
}
bootstrap();
