import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';
import { LoggingService } from './common/logging/logging.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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

  const logger = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (err: Error) => {
    logger.error(`Uncaught exception: ${err.message}`, err.stack, 'Process');
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(
      `Unhandled rejection: ${JSON.stringify(reason)}`,
      reason instanceof Error ? reason.stack : undefined,
      'Process',
    );
  });

  logger.log('Application starting...', 'Bootstrap');

  await app.listen(port);
}

bootstrap();
