import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserExistsFilter } from './users/filters/user-exists.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3000;

  const winstonConfig: winston.LoggerOptions = {
    transports: [new winston.transports.File({ filename: 'logInfo.log' })],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  };

  app.useLogger(WinstonModule.createLogger(winstonConfig));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new UserExistsFilter());
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const options = new DocumentBuilder()
    .setTitle('S0T12 API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(`Server is running on s0t12.com (:`);
  });
}
bootstrap();
