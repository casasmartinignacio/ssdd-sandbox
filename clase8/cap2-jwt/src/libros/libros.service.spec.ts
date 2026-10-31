import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LibrosRepository } from './libros.repository';
import { LibrosService } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      providers: [LibrosService, LibrosRepository],
    }).compile();
    service = modulo.get(LibrosService);
  });

  const datos = {
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    isbn: '9788437604572',
    categoria: 'novela',
    anio: 1963,
    ejemplares: 2,
  };

  it('crea un libro con todos los ejemplares disponibles', () => {
    const libro = service.create(datos);

    expect(libro.disponibles).toBe(2);
  });

  it('lanza NotFoundException si el libro no existe', () => {
    expect(() => service.findOne(999999)).toThrow(NotFoundException);
  });
});
