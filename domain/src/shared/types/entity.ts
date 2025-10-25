/**
 * Tipos base para entidades del dominio
 */

export interface Entity {
  readonly id: string;
  readonly fechaCreacion: Date;
  readonly fechaActualizacion: Date;
}

export interface ValueObject {
  equals(other: ValueObject): boolean;
}

export interface AggregateRoot extends Entity {
  version: number;
}
