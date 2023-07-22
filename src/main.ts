import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserExistsFilter } from './users/filters/user-exists.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT) || 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UserExistsFilter());
  await app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}/`);
  });
}
bootstrap();
