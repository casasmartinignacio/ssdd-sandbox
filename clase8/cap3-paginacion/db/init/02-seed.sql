-- Datos de prueba para la base biblioteca (se ejecuta una sola vez).
--   100.000 libros  (los títulos se repiten a propósito: unos 33 libros por título)
--     5.000 socios
--    40.000 préstamos devueltos + 2.000 activos (la mitad, vencidos)
-- Los datos son pseudoaleatorios pero deterministas: siempre se generan los mismos.
-- seq_1_to_N es el generador de secuencias propio de MariaDB.

USE biblioteca;

INSERT INTO libros (titulo, autor, isbn, categoria, anio, ejemplares, disponibles)
SELECT
  CONCAT(
    ELT(1 + MOD(n, 20), 'Introducción a', 'Fundamentos de', 'Manual de', 'Curso de', 'Teoría de',
        'Práctica de', 'Historia de', 'Principios de', 'Elementos de', 'Problemas de',
        'Tratado de', 'Lecciones de', 'Apuntes de', 'Guía de', 'Estudios sobre',
        'Casos de', 'Métodos de', 'Aplicaciones de', 'Diseño de', 'Análisis de'),
    ' ',
    ELT(1 + MOD((n DIV 20), 150), 'la física', 'la química', 'la biología', 'el álgebra', 'el cálculo',
        'la estadística', 'la programación', 'las bases de datos', 'las redes', 'los sistemas operativos',
        'la inteligencia artificial', 'la economía', 'la contabilidad', 'el derecho civil', 'el derecho penal',
        'la sociología', 'la psicología', 'la filosofía', 'la literatura', 'la historia argentina',
        'la geografía', 'la arquitectura', 'la ingeniería civil', 'la electrónica', 'la termodinámica',
        'la mecánica', 'la óptica', 'la genética', 'la ecología', 'la medicina',
        'la nutrición', 'la pedagogía', 'la lingüística', 'la música', 'el arte moderno',
        'la astronomía', 'la geología', 'la robótica', 'la criptografía', 'los algoritmos',
        'las estructuras de datos', 'la compilación', 'los sistemas distribuidos', 'la seguridad informática', 'el cine',
        'el teatro', 'la poesía', 'la política', 'las relaciones internacionales', 'el marketing',
        'la administración', 'la logística', 'la agronomía', 'la veterinaria', 'la oceanografía',
        'la climatología', 'la urbanística', 'el diseño gráfico', 'la fotografía', 'la antropología',
        'la arqueología', 'la matemática discreta', 'la lógica', 'la geometría', 'la topología',
        'la teoría de números', 'el análisis numérico', 'la investigación operativa', 'la mecánica cuántica', 'la relatividad',
        'la biotecnología', 'la microbiología', 'la farmacología', 'la anatomía', 'la fisiología',
        'la epidemiología', 'la psiquiatría', 'la neurociencia', 'la educación', 'el periodismo',
        'la comunicación', 'la traducción', 'la gramática', 'la retórica', 'la ética',
        'la estética', 'la teología', 'la mitología', 'la numismática', 'la heráldica',
        'la cartografía', 'la meteorología', 'la hidrología', 'la minería', 'la metalurgia',
        'la soldadura', 'la carpintería', 'la cerámica', 'la cocina', 'la enología',
        'la apicultura', 'la jardinería', 'la ornitología', 'la botánica', 'la zoología',
        'la paleontología', 'la volcanología', 'la sismología', 'la energía solar', 'la energía eólica',
        'los materiales', 'los polímeros', 'los semiconductores', 'las telecomunicaciones', 'el procesamiento de señales',
        'la visión por computadora', 'el aprendizaje automático', 'la computación en la nube', 'los contenedores', 'los microservicios',
        'las pruebas de software', 'la ingeniería de requisitos', 'la gestión de proyectos', 'la calidad', 'la usabilidad',
        'los videojuegos', 'la realidad virtual', 'el internet de las cosas', 'la computación cuántica', 'las finanzas',
        'los seguros', 'el comercio exterior', 'la auditoría', 'los impuestos', 'el derecho laboral',
        'el derecho comercial', 'el derecho ambiental', 'los derechos humanos', 'la criminología', 'la medicina legal',
        'la enfermería', 'la odontología', 'la kinesiología', 'la fonoaudiología', 'la terapia ocupacional',
        'la psicopedagogía', 'la geriatría', 'la pediatría', 'la oncología', 'la cardiología'),
    ' ',
    ELT(1 + MOD((n DIV 3000), 3), 'I', 'II', 'III')
  ) AS titulo,
  CONCAT(
    ELT(1 + MOD(n * 7, 25), 'Ana', 'Luis', 'María', 'Carlos', 'Lucía', 'Jorge', 'Sofía', 'Pedro', 'Elena', 'Martín',
        'Laura', 'Diego', 'Julia', 'Pablo', 'Carmen', 'Andrés', 'Paula', 'Ricardo', 'Silvia', 'Hugo',
        'Marta', 'Raúl', 'Inés', 'Tomás', 'Clara'),
    ' ',
    ELT(1 + MOD(n * 11, 30), 'García', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Romero', 'Díaz',
        'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Suárez',
        'Aguirre', 'Giménez', 'Gutiérrez', 'Castro', 'Ortiz', 'Silva', 'Molina', 'Rojas', 'Vega', 'Cabrera')
  ) AS autor,
  CONCAT('978', LPAD(MOD(n * 7919, 10000000000), 10, '0')) AS isbn,
  ELT(1 + MOD(n, 12), 'ciencias', 'matemática', 'informática', 'ingeniería', 'medicina', 'derecho',
      'economía', 'humanidades', 'arte', 'literatura', 'historia', 'idiomas') AS categoria,
  1950 + MOD(n * 31, 76) AS anio,
  1 + MOD(n, 10) AS ejemplares,
  1 + MOD(n, 10) AS disponibles
FROM (SELECT CAST(seq AS SIGNED) AS n FROM seq_1_to_100000) AS s;

INSERT INTO socios (nombre, email)
SELECT
  CONCAT(
    ELT(1 + MOD(n, 25), 'Ana', 'Luis', 'María', 'Carlos', 'Lucía', 'Jorge', 'Sofía', 'Pedro', 'Elena', 'Martín',
        'Laura', 'Diego', 'Julia', 'Pablo', 'Carmen', 'Andrés', 'Paula', 'Ricardo', 'Silvia', 'Hugo',
        'Marta', 'Raúl', 'Inés', 'Tomás', 'Clara'),
    ' ',
    ELT(1 + MOD(n * 3, 30), 'García', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Romero', 'Díaz',
        'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Suárez',
        'Aguirre', 'Giménez', 'Gutiérrez', 'Castro', 'Ortiz', 'Silva', 'Molina', 'Rojas', 'Vega', 'Cabrera')
  ),
  CONCAT('socio', n, '@uni.edu')
FROM (SELECT CAST(seq AS SIGNED) AS n FROM seq_1_to_5000) AS s;

-- Préstamos históricos: todos devueltos, algunos con atraso (y, por lo tanto, multa)
INSERT INTO prestamos (libro_id, socio_id, prestado_en, vencimiento, devuelto_en, multa)
SELECT
  1 + MOD(n * 7919, 100000),
  1 + MOD(n * 13, 5000),
  TIMESTAMP('2025-01-01 09:00:00') + INTERVAL n HOUR,
  TIMESTAMP('2025-01-01 09:00:00') + INTERVAL n HOUR + INTERVAL 14 DAY,
  TIMESTAMP('2025-01-01 09:00:00') + INTERVAL n HOUR + INTERVAL (3 + MOD(n, 20)) DAY,
  100 * GREATEST(0, (3 + MOD(n, 20)) - 14)
FROM (SELECT CAST(seq AS SIGNED) AS n FROM seq_1_to_40000) AS s;

-- Préstamos activos: uno por socio para los primeros 2.000 socios; los más viejos ya vencieron
INSERT INTO prestamos (libro_id, socio_id, prestado_en, vencimiento, devuelto_en, multa)
SELECT
  1 + MOD(n * 37, 100000),
  n,
  UTC_TIMESTAMP() - INTERVAL (1 + MOD(n, 30)) DAY,
  UTC_TIMESTAMP() - INTERVAL (1 + MOD(n, 30)) DAY + INTERVAL 14 DAY,
  NULL,
  0
FROM (SELECT CAST(seq AS SIGNED) AS n FROM seq_1_to_2000) AS s;

-- Coherencia: un ejemplar menos disponible por cada préstamo activo
UPDATE libros
SET disponibles = disponibles - 1
WHERE id IN (SELECT libro_id FROM prestamos WHERE devuelto_en IS NULL);
