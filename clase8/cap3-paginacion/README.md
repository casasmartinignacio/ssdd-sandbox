# Biblioteca: base del capítulo 3 (Paginación)

API REST de una biblioteca universitaria (libros, socios y préstamos) sobre **NestJS + TypeORM + MariaDB**.
Todo el entorno corre en Docker: la aplicación, la base de datos y un cliente web de la base.
El enunciado, con las reglas de negocio, está en el capítulo 3 del manual.

## Requisitos

- Docker con Docker Compose (Docker Desktop en Windows y macOS).
- Un cliente REST (extensión REST Client de VS Code, Thunder Client o similar).

No hace falta instalar Node.js ni MariaDB.

## Levantar el entorno

```bash
docker compose up --build
```

La primera vez demora unos minutos: descarga las imágenes, instala las dependencias y crea la base con sus datos.
Cuando en la consola aparezca `Nest application successfully started`, la API está en http://localhost:3000.

| Servicio | Dirección | Para qué |
|---|---|---|
| `api` | http://localhost:3000 | La aplicación NestJS (se recarga al guardar cambios) |
| `db` | `localhost:3306` | MariaDB. Usuario `biblioteca`, contraseña `biblioteca` (root: `root`) |
| `adminer` | http://localhost:8080 | Cliente web: sistema *MySQL*, servidor `db`, usuario `biblioteca`, contraseña `biblioteca` |

Comprobación rápida: `GET http://localhost:3000/salud` debe responder `{"estado":"ok", ...}`.

## Datos de prueba

La base `biblioteca` se crea con estos registros (siempre los mismos, son pseudoaleatorios pero deterministas):

| Tabla | Registros | Observaciones |
|---|---|---|
| `libros` | 100.000 | Unos 9.000 títulos distintos: los títulos **se repiten** (en promedio, 11 libros por título) |
| `socios` | 5.000 | |
| `prestamos` | 42.000 | 40.000 devueltos (algunos con multa) y 2.000 activos, de los cuales unos 1.000 están vencidos |

Las tablas tienen solo clave primaria. Su estructura está en `db/init/01-schema.sql` y los datos en `db/init/02-seed.sql`.

## Probar la API

Con el entorno levantado, pruebe los endpoints con su cliente REST. Por ejemplo:

```http
GET http://localhost:3000/libros/1
GET http://localhost:3000/prestamos/vencidos
```

Atención: hoy `GET /libros` devuelve los 100.000 libros en una sola respuesta.

## Ejecutar los tests

Los tests corren dentro del contenedor de la API, con la base en funcionamiento:

```bash
docker compose exec api npm test          # unitarios
docker compose exec api npm run test:e2e  # e2e
```

Los tests e2e usan la base **`biblioteca_test`**, que existe vacía y con la misma estructura, de modo que nunca modifican los datos de prueba.
Si el entorno no está levantado, use `docker compose run --rm api npm run test:e2e` (levanta la base y ejecuta los tests).

## Operaciones útiles

```bash
docker compose logs -f api      # ver el registro de la aplicación
docker compose restart api      # reiniciar la API (si no detecta cambios de archivos en Windows)
docker compose exec db mariadb -ubiblioteca -pbiblioteca biblioteca   # consola SQL
docker compose down             # detener el entorno (se conservan los datos)
docker compose down -v          # detener y BORRAR los datos: la próxima vez se regeneran desde cero
```

Si modifica `db/init/*.sql`, los cambios solo se aplican al recrear la base con `docker compose down -v`.
Si agrega dependencias a `package.json`, reconstruya con `docker compose up --build`.
