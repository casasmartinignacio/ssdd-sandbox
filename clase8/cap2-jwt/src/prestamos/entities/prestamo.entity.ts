export class Prestamo {
  id: number;
  libroId: number;
  socioId: number;
  prestadoEn: string; // ISO 8601
  vencimiento: string; // ISO 8601
  devueltoEn: string | null;
  multa: number;
}
