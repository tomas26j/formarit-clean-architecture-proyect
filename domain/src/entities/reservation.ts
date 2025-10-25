import { Entity } from "../utils/types";
import { Periodo, PeriodoImpl } from "../utils/types/lapse.js";
import { Precio, PrecioImpl } from "../utils/types/precio.js";

// Estados de la reserva
export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CHECKIN = 'checkin',
  CHECKOUT = 'checkout',
  CANCELADA = 'cancelada'
}

// Agregado: Reserva (Entidad Raíz)
export interface Reserva extends Entity {
  readonly habitacionId: string;
  readonly clienteId: string;
  readonly periodo: Periodo;
  readonly estado: EstadoReserva;
  readonly precioTotal: Precio;
  readonly numeroHuespedes: number;
  readonly observaciones?: string;
  
  // Comportamientos del agregado
  confirmar(): Reserva;
  cancelar(motivo: string): Reserva;
  realizarCheckIn(): Reserva;
  realizarCheckOut(): Reserva;
  puedeCancelarse(): boolean;
  puedeModificarse(): boolean;
  calcularPenalizacionCancelacion(): Precio;
}

export class ReservaImpl implements Reserva {
  constructor(
    public readonly id: string,
    public readonly habitacionId: string,
    public readonly clienteId: string,
    public readonly periodo: Periodo,
    public readonly estado: EstadoReserva,
    public readonly precioTotal: Precio,
    public readonly numeroHuespedes: number = 1,
    public readonly observaciones?: string
  ) {
    this.validarReserva();
  }

  private validarReserva(): void {
    if (!this.habitacionId || this.habitacionId.trim().length === 0) {
      throw new Error('El ID de habitación es requerido');
    }
    
    if (!this.clienteId || this.clienteId.trim().length === 0) {
      throw new Error('El ID de cliente es requerido');
    }
    
    if (this.numeroHuespedes <= 0) {
      throw new Error('El número de huéspedes debe ser mayor a 0');
    }
  }

  confirmar(): Reserva {
    if (this.estado !== EstadoReserva.PENDIENTE) {
      throw new Error('Solo las reservas pendientes pueden confirmarse');
    }
    
    return new ReservaImpl(
      this.id,
      this.habitacionId,
      this.clienteId,
      this.periodo,
      EstadoReserva.CONFIRMADA,
      this.precioTotal,
      this.numeroHuespedes,
      this.observaciones
    );
  }

  cancelar(motivo: string): Reserva {
    if (!this.puedeCancelarse()) {
      throw new Error('Esta reserva no puede cancelarse en su estado actual');
    }
    
    if (!motivo || motivo.trim().length === 0) {
      throw new Error('El motivo de cancelación es requerido');
    }
    
    return new ReservaImpl(
      this.id,
      this.habitacionId,
      this.clienteId,
      this.periodo,
      EstadoReserva.CANCELADA,
      this.precioTotal,
      this.numeroHuespedes,
      motivo
    );
  }

  realizarCheckIn(): Reserva {
    if (this.estado !== EstadoReserva.CONFIRMADA) {
      throw new Error('Solo las reservas confirmadas pueden realizar check-in');
    }
    
    return new ReservaImpl(
      this.id,
      this.habitacionId,
      this.clienteId,
      this.periodo,
      EstadoReserva.CHECKIN,
      this.precioTotal,
      this.numeroHuespedes,
      this.observaciones
    );
  }

  realizarCheckOut(): Reserva {
    if (this.estado !== EstadoReserva.CHECKIN) {
      throw new Error('Solo las reservas en check-in pueden realizar check-out');
    }
    
    return new ReservaImpl(
      this.id,
      this.habitacionId,
      this.clienteId,
      this.periodo,
      EstadoReserva.CHECKOUT,
      this.precioTotal,
      this.numeroHuespedes,
      this.observaciones
    );
  }

  puedeCancelarse(): boolean {
    return this.estado === EstadoReserva.PENDIENTE || this.estado === EstadoReserva.CONFIRMADA;
  }

  puedeModificarse(): boolean {
    return this.estado === EstadoReserva.PENDIENTE;
  }

  calcularPenalizacionCancelacion(): Precio {
    if (this.estado !== EstadoReserva.CANCELADA) {
      return PrecioImpl.cero();
    }
    
    // Lógica de penalización basada en tiempo de cancelación
    const diasAntesCheckIn = Math.ceil(
      (this.periodo.checkIn.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diasAntesCheckIn >= 7) {
      return PrecioImpl.cero(); // Sin penalización
    } else if (diasAntesCheckIn >= 3) {
      return this.precioTotal.multiplicar(0.25); // 25% de penalización
    } else if (diasAntesCheckIn >= 1) {
      return this.precioTotal.multiplicar(0.5); // 50% de penalización
    } else {
      return this.precioTotal; // 100% de penalización
    }
  }

  static crear(
    id: string,
    habitacionId: string,
    clienteId: string,
    periodo: Periodo,
    precioTotal: Precio,
    numeroHuespedes: number = 1,
    observaciones?: string
  ): Reserva {
    return new ReservaImpl(
      id,
      habitacionId,
      clienteId,
      periodo,
      EstadoReserva.PENDIENTE,
      precioTotal,
      numeroHuespedes,
      observaciones
    );
  }
}

// Alias para mantener compatibilidad
export type Reservation = Reserva;
export const ReservationImpl = ReservaImpl;