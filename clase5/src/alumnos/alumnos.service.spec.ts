import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonDb } from '../database/json-db';
import { AlumnosService } from './alumnos.service';

describe('AlumnosService', () => {
  let directory: string;
  let service: AlumnosService;
  let db: JsonDb;
  const previousDataFile = process.env.DATA_FILE;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'clase5-'));
    process.env.DATA_FILE = join(directory, 'db.json');
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlumnosService, JsonDb],
    }).compile();
    service = module.get(AlumnosService);
    db = module.get(JsonDb);
  });

  afterEach(async () => {
    if (previousDataFile === undefined) delete process.env.DATA_FILE;
    else process.env.DATA_FILE = previousDataFile;
    await rm(directory, { recursive: true, force: true });
  });

  it('crea un alumno', async () => {
    const alumno = await service.create({
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@correo.edu',
      legajo: 'A-1',
    });

    expect(alumno.id).toEqual(expect.any(String));
    expect(alumno.email).toBe('ana@correo.edu');
    await expect(service.findAll()).resolves.toEqual([alumno]);
  });

  it('rechaza un email o legajo repetido', async () => {
    await service.create({
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@correo.edu',
      legajo: 'A-1',
    });

    await expect(
      service.create({
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana@correo.edu',
        legajo: 'A-2',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('no encuentra un alumno inexistente', async () => {
    await expect(service.findOne('uuid')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('no elimina un alumno con inscripciones', async () => {
    const alumno = await service.create({
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@correo.edu',
      legajo: 'A-1',
    });
    await db.update((data) => {
      data.inscripciones.push({
        id: 'inscripcion-1',
        alumnoId: alumno.id,
        materia: 'Matemática I',
        anio: 2026,
        cuatrimestre: 1,
      });
    });

    await expect(service.remove(alumno.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(service.findOne(alumno.id)).resolves.toMatchObject({
      id: alumno.id,
    });
  });
});
