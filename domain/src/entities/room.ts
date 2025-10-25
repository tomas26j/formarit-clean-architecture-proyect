import { Entity } from "../utils/types";
import { TipoHabitacion, TipoHabitacionImpl } from "../utils/types/room-type.js";
import { Precio, PrecioImpl } from "../utils/types/precio.js";

// Agregado: Habitación
export interface Habitacion extends Entity {
  readonly numero: string;
  readonly tipo: TipoHabitacion;
  readonly precioBase: Precio;
  readonly activa: boolean;
  readonly piso: number;
  readonly vista: string;
  
  // Comportamientos del agregado
  puedeReservarse(): boolean;
  calcularPrecioTotal(duracionNoches: number): Precio;
  desactivar(): Habitacion;
  activar(): Habitacion;
  cambiarPrecio(nuevoPrecio: Precio): Habitacion;
}

export class HabitacionImpl implements Habitacion {
  constructor(
    public readonly id: string,
    public readonly numero: string,
    public readonly tipo: TipoHabitacion,
    public readonly precioBase: Precio,
    public readonly activa: boolean = true,
    public readonly piso: number = 1,
    public readonly vista: string = 'estándar'
  ) {
    this.validarHabitacion();
  }

  private validarHabitacion(): void {
    if (!this.numero || this.numero.trim().length === 0) {
      throw new Error('El número de habitación es requerido');
    }
    
    if (this.piso < 1) {
      throw new Error('El piso debe ser mayor a 0');
    }
  }

  puedeReservarse(): boolean {
    return this.activa;
  }

  calcularPrecioTotal(duracionNoches: number): Precio {
    if (duracionNoches <= 0) {
      throw new Error('La duración debe ser mayor a 0');
    }
    return this.precioBase.multiplicar(duracionNoches);
  }

  desactivar(): Habitacion {
    if (!this.activa) {
      throw new Error('La habitación ya está desactivada');
    }
    return new HabitacionImpl(
      this.id,
      this.numero,
      this.tipo,
      this.precioBase,
      false,
      this.piso,
      this.vista
    );
  }

  activar(): Habitacion {
    if (this.activa) {
      throw new Error('La habitación ya está activa');
    }
    return new HabitacionImpl(
      this.id,
      this.numero,
      this.tipo,
      this.precioBase,
      true,
      this.piso,
      this.vista
    );
  }

  cambiarPrecio(nuevoPrecio: Precio): Habitacion {
    return new HabitacionImpl(
      this.id,
      this.numero,
      this.tipo,
      nuevoPrecio,
      this.activa,
      this.piso,
      this.vista
    );
  }

  static crear(
    id: string,
    numero: string,
    tipo: TipoHabitacion,
    precioBase: Precio,
    piso: number = 1,
    vista: string = 'estándar'
  ): Habitacion {
    return new HabitacionImpl(id, numero, tipo, precioBase, true, piso, vista);
  }
}

// Alias para mantener compatibilidad
export type Room = Habitacion;
export const RoomImpl = HabitacionImpl;

