import { Habitacion } from "../entities/room.js";
import { Reserva, EstadoReserva } from "../entities/reservation.js";
import { Periodo } from "../utils/types/lapse.js";
import { TipoHabitacion } from "../utils/types/room-type.js";

// Servicio de Dominio: Verificación de Disponibilidad
export interface ServicioDisponibilidad {
  verificarDisponibilidad(habitacionId: string, periodo: Periodo): Promise<boolean>;
  buscarHabitacionesDisponibles(periodo: Periodo, tipo?: TipoHabitacion): Promise<Habitacion[]>;
  verificarDisponibilidadConReservas(habitacionId: string, periodo: Periodo, reservasExistentes: Reserva[]): boolean;
  calcularTiempoLimpieza(habitacion: Habitacion): number; // en horas
  verificarDisponibilidadConLimpieza(habitacionId: string, periodo: Periodo, reservasExistentes: Reserva[]): boolean;
}

