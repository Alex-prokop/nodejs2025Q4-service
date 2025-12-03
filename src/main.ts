import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerDocument = YAML.load(join(process.cwd(), 'doc', 'api.yaml'));
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 4000;

  await app.listen(port);
}

bootstrap();
