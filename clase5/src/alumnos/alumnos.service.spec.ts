import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './entities/alumno.entity';

describe('AlumnosService', () => {
  let service: AlumnosService;
  const alumnos = {
    create: jest.fn((dto: Partial<Alumno>) => dto),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };
  const inscripciones = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlumnosService,
        { provide: getRepositoryToken(Alumno), useValue: alumnos },
        { provide: getRepositoryToken(Inscripcion), useValue: inscripciones },
      ],
    }).compile();
    service = module.get(AlumnosService);
  });

  it('crea un alumno', async () => {
    const dto = {
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@correo.edu',
      legajo: 'A-1',
    };
    alumnos.save.mockResolvedValue({ id: 'uuid', ...dto });

    await expect(service.create(dto)).resolves.toMatchObject(dto);
    expect(alumnos.create).toHaveBeenCalledWith(dto);
  });

  it('rechaza un email o legajo repetido', async () => {
    alumnos.save.mockRejectedValue(
      new QueryFailedError('insert', [], { code: '23505', message: 'dup' }),
    );

    await expect(
      service.create({
        nombre: 'Ana',
        apellido: 'Pérez',
        email: 'ana@correo.edu',
        legajo: 'A-1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('no encuentra un alumno inexistente', async () => {
    alumnos.findOneBy.mockResolvedValue(null);
    await expect(service.findOne('uuid')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('no elimina un alumno con inscripciones', async () => {
    alumnos.findOneBy.mockResolvedValue({ id: 'uuid' });
    inscripciones.count.mockResolvedValue(1);

    await expect(service.remove('uuid')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(alumnos.delete).not.toHaveBeenCalled();
  });
});
