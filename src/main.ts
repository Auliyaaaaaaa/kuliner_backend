import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS agar frontend bisa mengakses backend
  app.enableCors();

  const PORT = process.env.PORT || 3002;
  await app.listen(3002);
  console.log(`Server berjalan di port ${PORT} 🍜`);
}
bootstrap();
