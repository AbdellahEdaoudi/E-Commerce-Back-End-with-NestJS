import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody:true,
    bodyParser:true,
  });
  app.setGlobalPrefix("/api")
  await app.listen(3000);
}

export const handler = bootstrap;
