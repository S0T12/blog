import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserExistsFilter } from './users/filters/user-exists.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UserExistsFilter());
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
  });
}
bootstrap();
