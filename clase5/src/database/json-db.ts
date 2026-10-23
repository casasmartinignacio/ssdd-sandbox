import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { InstanciaNota } from '../notas/entities/nota.entity';

export type InscripcionGuardada = {
  id: string;
  alumnoId: string;
  materia: string;
  anio: number;
  cuatrimestre: number;
};

export type NotaGuardada = {
  id: string;
  inscripcionId: string;
  valor: number;
  instancia: InstanciaNota;
  fecha: string;
};

export type DatabaseFile = {
  alumnos: Alumno[];
  inscripciones: InscripcionGuardada[];
  notas: NotaGuardada[];
};

function emptyDatabase(): DatabaseFile {
  return { alumnos: [], inscripciones: [], notas: [] };
}

@Injectable()
export class JsonDb {
  private queue: Promise<unknown> = Promise.resolve();

  filePath(): string {
    return process.env.DATA_FILE ?? join(process.cwd(), 'data', 'db.json');
  }

  async read(): Promise<DatabaseFile> {
    try {
      const raw = await readFile(this.filePath(), 'utf8');
      return JSON.parse(raw) as DatabaseFile;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return emptyDatabase();
      }
      throw error;
    }
  }

  update<T>(change: (db: DatabaseFile) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const db = await this.read();
      const result = change(db);
      await this.write(db);
      return result;
    });
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private async write(db: DatabaseFile): Promise<void> {
    const path = this.filePath();
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.${randomUUID()}.tmp`;
    await writeFile(temporary, `${JSON.stringify(db, null, 2)}\n`);
    await rename(temporary, path);
  }
}
