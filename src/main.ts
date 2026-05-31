import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT); // ← ubah ini, jangan hardcode 3002
  console.log(`Server berjalan di port ${PORT} 🍜`);
}
bootstrap();