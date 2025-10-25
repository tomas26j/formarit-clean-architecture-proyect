import { Reserva } from "../entities/reservation.js";
import { Periodo } from "../utils/types/lapse.js";
import { EstadoReserva } from "../entities/reservation.js";

// Repositorio: Gestión de Reservas
export interface RepositorioReservas {
  // Operaciones básicas
  guardar(reserva: Reserva): Promise<void>;
  buscarPorId(id: string): Promise<Reserva | null>;
  eliminar(id: string): Promise<void>;
  
  // Búsquedas específicas del dominio
  buscarPorCliente(clienteId: string): Promise<Reserva[]>;
  buscarPorHabitacion(habitacionId: string): Promise<Reserva[]>;
  buscarPorHabitacionYPeriodo(habitacionId: string, periodo: Periodo): Promise<Reserva[]>;
  buscarPorEstado(estado: EstadoReserva): Promise<Reserva[]>;
  buscarPorPeriodo(periodo: Periodo): Promise<Reserva[]>;
  
  // Búsquedas complejas
  buscarReservasActivas(): Promise<Reserva[]>;
  buscarReservasPendientes(): Promise<Reserva[]>;
  buscarReservasPorConfirmar(): Promise<Reserva[]>;
  buscarReservasVencidas(): Promise<Reserva[]>;
  
  // Operaciones de consulta
  contarReservasPorCliente(clienteId: string): Promise<number>;
  contarReservasPorHabitacion(habitacionId: string): Promise<number>;
  verificarExistencia(id: string): Promise<boolean>;
  
  // Operaciones de actualización masiva
  actualizarEstado(id: string, nuevoEstado: EstadoReserva): Promise<void>;
  cancelarReservasVencidas(): Promise<number>; // Retorna cantidad cancelada
}
