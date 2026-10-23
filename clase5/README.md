# Clase 5 — API de alumnos

API REST en NestJS para alumnos, inscripciones y notas. Postgres guarda los datos. Nginx recibe el tráfico y lo reenvía a la API.

## Cómo levantarla

Hace falta Docker. Desde esta carpeta:

```bash
docker compose up --build
```

- API: http://localhost:8080/api
- Documentación: http://localhost:8080/docs
- Salud: http://localhost:8080/api/health

El puerto público es **8080**. Nginx escucha ahí y proxyea a la API, que adentro de Docker usa el puerto 3000.

## Recursos

| Recurso | Rutas |
| --- | --- |
| Alumnos | `POST/GET /api/alumnos`, `GET/PATCH/DELETE /api/alumnos/:id` |
| Inscripciones | `POST/GET /api/inscripciones`, `GET/PATCH/DELETE /api/inscripciones/:id` |
| Notas | `POST/GET /api/notas`, `GET/PATCH/DELETE /api/notas/:id` |

`GET /api/inscripciones?alumnoId=` lista las de un alumno. `GET /api/notas?inscripcionId=` lista las de una inscripción.

Una inscripción es única por alumno, materia, año y cuatrimestre. No se borra un alumno que tiene inscripciones, ni una inscripción que tiene notas.

## Desarrollo sin Docker

Node 22. Copiá `.env.example` a `.env`, levantá Postgres y después:

```bash
npm install
npm run start:dev
```

## Estructura

Cada recurso tiene su módulo, con controller, service, DTOs y entidad. `DatabaseModule` configura TypeORM. `ValidationPipe` descarta campos de más y transforma los tipos. Swagger se genera en `/docs`.

`DATABASE_SYNC=true` crea las tablas al arrancar. Sirve para la clase. En un proyecto real eso se reemplaza por migraciones.

## Tests

`npm test` prueba el servicio de alumnos con repositorios falsos, sin Postgres. `npm run test:e2e` prueba `GET /api/health`. Jest no puede cargar `@nestjs/typeorm` porque ese paquete es ESM, así que `src/testing/nestjs-typeorm.mock.ts` reemplaza el decorador `InjectRepository` y deja el mismo token de inyección.

## CI

`.github/workflows/ci.yml` corre lint, tests y el build de la imagen. En este repositorio el workflow que se ejecuta es el de la raíz, `.github/workflows/clase5.yml`, porque GitHub Actions solo mira la carpeta `.github` del repo.
