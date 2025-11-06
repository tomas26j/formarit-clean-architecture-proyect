import { Reserva } from "../entities/reservation.js";
import { Periodo } from "../utils/types/lapse.js";
import { EstadoReserva } from "../entities/reservation.js";
export interface RepositorioReservas {
    guardar(reserva: Reserva): Promise<void>;
    buscarPorId(id: string): Promise<Reserva | null>;
    eliminar(id: string): Promise<void>;
    buscarPorCliente(clienteId: string): Promise<Reserva[]>;
    buscarPorHabitacion(habitacionId: string): Promise<Reserva[]>;
    buscarPorHabitacionYPeriodo(habitacionId: string, periodo: Periodo): Promise<Reserva[]>;
    buscarPorEstado(estado: EstadoReserva): Promise<Reserva[]>;
    buscarPorPeriodo(periodo: Periodo): Promise<Reserva[]>;
    buscarReservasActivas(): Promise<Reserva[]>;
    buscarReservasPendientes(): Promise<Reserva[]>;
    buscarReservasPorConfirmar(): Promise<Reserva[]>;
    buscarReservasVencidas(): Promise<Reserva[]>;
    contarReservasPorCliente(clienteId: string): Promise<number>;
    contarReservasPorHabitacion(habitacionId: string): Promise<number>;
    verificarExistencia(id: string): Promise<boolean>;
    actualizarEstado(id: string, nuevoEstado: EstadoReserva): Promise<void>;
    cancelarReservasVencidas(): Promise<number>;
}
