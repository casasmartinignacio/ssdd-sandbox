import { QueryFailedError } from 'typeorm';

export function esClaveDuplicada(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) return false;
  const driverError = error.driverError as { code?: string };
  return driverError.code === '23505';
}
