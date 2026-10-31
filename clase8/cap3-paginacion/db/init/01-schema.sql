-- Estructura de las tablas. Se ejecuta una sola vez, al crear el volumen de la base.
-- Hay dos bases con la misma estructura:
--   biblioteca       datos de prueba (los carga 02-seed.sql); la usa la aplicación
--   biblioteca_test  vacía; la usan los tests e2e
-- Las tablas tienen solo clave primaria: cualquier índice adicional es decisión suya.

CREATE DATABASE IF NOT EXISTS biblioteca      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS biblioteca_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON biblioteca_test.* TO 'biblioteca'@'%';

USE biblioteca;

CREATE TABLE libros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  autor       VARCHAR(120) NOT NULL,
  isbn        VARCHAR(17)  NOT NULL,
  categoria   VARCHAR(60)  NOT NULL,
  anio        SMALLINT     NOT NULL,
  ejemplares  SMALLINT     NOT NULL,
  disponibles SMALLINT     NOT NULL
);

CREATE TABLE socios (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email  VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE prestamos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  libro_id    INT      NOT NULL,
  socio_id    INT      NOT NULL,
  prestado_en DATETIME NOT NULL,
  vencimiento DATETIME NOT NULL,
  devuelto_en DATETIME NULL,
  multa       INT      NOT NULL DEFAULT 0,
  FOREIGN KEY (libro_id) REFERENCES libros (id),
  FOREIGN KEY (socio_id) REFERENCES socios (id)
);

USE biblioteca_test;

CREATE TABLE libros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  autor       VARCHAR(120) NOT NULL,
  isbn        VARCHAR(17)  NOT NULL,
  categoria   VARCHAR(60)  NOT NULL,
  anio        SMALLINT     NOT NULL,
  ejemplares  SMALLINT     NOT NULL,
  disponibles SMALLINT     NOT NULL
);

CREATE TABLE socios (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email  VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE prestamos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  libro_id    INT      NOT NULL,
  socio_id    INT      NOT NULL,
  prestado_en DATETIME NOT NULL,
  vencimiento DATETIME NOT NULL,
  devuelto_en DATETIME NULL,
  multa       INT      NOT NULL DEFAULT 0,
  FOREIGN KEY (libro_id) REFERENCES libros (id),
  FOREIGN KEY (socio_id) REFERENCES socios (id)
);
