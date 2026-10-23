import { Inject } from '@nestjs/common';

export function getRepositoryToken(entity: { name: string }): string {
  return `${entity.name}Repository`;
}

export const InjectRepository =
  (entity: { name: string }): ParameterDecorator =>
  (target, propertyKey, parameterIndex) => {
    Inject(getRepositoryToken(entity))(target, propertyKey, parameterIndex);
  };
