import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { LibrosService } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;
  const repo = {
    findOneBy: jest.fn(),
    create: jest.fn((datos) => datos),
    save: jest.fn((libro) => Promise.resolve({ id: 1, ...libro })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [
        LibrosService,
        { provide: getRepositoryToken(Libro), useValue: repo },
      ],
    }).compile();
    service = modulo.get(LibrosService);
  });

  it('crea un libro con todos los ejemplares disponibles', async () => {
    const libro = await service.create({
      titulo: 'Rayuela',
      autor: 'Julio Cortázar',
      isbn: '9788437604572',
      categoria: 'novela',
      anio: 1963,
      ejemplares: 2,
    });

    expect(libro.disponibles).toBe(2);
  });

  it('lanza NotFoundException si el libro no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999999)).rejects.toThrow(NotFoundException);
  });
});
