import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// Formate toutes les erreurs HTTP de façon uniforme
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Applique la validation à toutes les routes de l'application
  app.useGlobalPipes(
    new ValidationPipe({
      // Convertit les paramètres reçus en string vers le type du DTO (ex: "2" -> 2)
      transform: true,
      // Supprime les propriétés absentes du DTO (parametres inconnus ignores)
      whitelist: true,
    }),
  );
  // Autorise le frontend (autre origine/port) a appeler l'API
  app.enableCors();
  // Formate toutes les erreurs HTTP de façon uniforme
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
