/**
 * Value Object para representar un período de tiempo
 */

export interface Periodo {
  readonly checkIn: Date;
  readonly checkOut: Date;
}

export interface PeriodoVO extends Periodo {
  readonly duracionNoches: number;
  readonly esValido(): boolean;
  readonly incluyeFecha(fecha: Date): boolean;
  readonly seSolapaCon(otro: Periodo): boolean;
}
