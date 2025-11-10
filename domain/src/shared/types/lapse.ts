/**
 * Value Object para representar un período de tiempo
 */

export interface Periodo {
  readonly checkIn: Date;
  readonly checkOut: Date;
}

export interface PeriodoVO extends Periodo {
  readonly duracionNoches: number;
  esValido(): boolean;
  incluyeFecha(fecha: Date): boolean;
  seSolapaCon(otro: Periodo): boolean;
}
