export enum InstanciaNota {
  PARCIAL = 'parcial',
  RECUPERATORIO = 'recuperatorio',
  FINAL = 'final',
  TP = 'tp',
}

export type Nota = {
  id: string;
  valor: number;
  instancia: InstanciaNota;
  fecha: string;
  inscripcion: {
    id: string;
    materia: string;
    anio: number;
    cuatrimestre: number;
  };
};
