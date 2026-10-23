# Clase 5 — API de alumnos

API REST en NestJS para alumnos, inscripciones y notas. Los datos se guardan en un archivo JSON. Nginx recibe el tráfico y lo reenvía a la API.

## Cómo levantarla sin Docker

Node 22. Desde esta carpeta:

```bash
npm install
npm run start:dev
```

El archivo aparece en `data/db.json` la primera vez que se guarda algo. La ruta se puede cambiar con `DATA_FILE` en un `.env` (hay un ejemplo en `.env.example`).

- API: http://localhost:3000/api
- Documentación: http://localhost:3000/docs
- Salud: http://localhost:3000/api/health

## Con Docker y proxy

```bash
docker compose up --build
```

- API: http://localhost:8080/api
- Documentación: http://localhost:8080/docs

El puerto público es **8080**. Nginx escucha ahí y proxyea a la API. El JSON queda en un volumen de Docker, así que los datos siguen después de reiniciar los contenedores.

## Recursos

| Recurso | Rutas |
| --- | --- |
| Alumnos | `POST/GET /api/alumnos`, `GET/PATCH/DELETE /api/alumnos/:id` |
| Inscripciones | `POST/GET /api/inscripciones`, `GET/PATCH/DELETE /api/inscripciones/:id` |
| Notas | `POST/GET /api/notas`, `GET/PATCH/DELETE /api/notas/:id` |

`GET /api/inscripciones?alumnoId=` lista las de un alumno. `GET /api/notas?inscripcionId=` lista las de una inscripción.

Una inscripción es única por alumno, materia, año y cuatrimestre. No se borra un alumno que tiene inscripciones, ni una inscripción que tiene notas.

## Estructura

Cada recurso tiene su módulo, con controller, service y DTOs. `JsonDb` lee y escribe `data/db.json`. Las escrituras van en fila para que dos pedidos no pisen el archivo. `ValidationPipe` descarta campos de más y transforma los tipos. Swagger se genera en `/docs`.

## Tests

`npm test` prueba el servicio de alumnos contra un JSON temporal. `npm run test:e2e` prueba `GET /api/health`.

## CI

`.github/workflows/ci.yml` corre lint, tests y el build de la imagen. En este repositorio el workflow que se ejecuta es el de la raíz, `.github/workflows/clase5.yml`, porque GitHub Actions solo mira la carpeta `.github` del repo.
