import { INestApplication, ValidationPipe } from '@nestjs/common';

// Configuración compartida por main.ts y los tests e2e
export function configurarApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
