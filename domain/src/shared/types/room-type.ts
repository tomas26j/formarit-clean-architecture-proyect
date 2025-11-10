/**
 * Value Object para representar el tipo de habitación
 */

export interface TipoHabitacion {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly capacidad: number;
  readonly amenidades: string[];
}

export interface TipoHabitacionVO extends TipoHabitacion {
  esValido(): boolean;
  puedeAlojar(numeroHuespedes: number): boolean;
  tieneAmenidad(amenidad: string): boolean;
}
