/**
 * DTOs para la entidad Reserva
 * Objetos de transferencia de datos para la capa de aplicación
 */
import { EstadoReserva } from "../../domain/entities/reserva";
export interface CrearReservaDTO {
    habitacionId: string;
    clienteId: string;
    checkIn: string;
    checkOut: string;
    numeroHuespedes: number;
    observaciones?: string;
}
export interface ReservaDTO {
    id: string;
    habitacionId: string;
    clienteId: string;
    checkIn: string;
    checkOut: string;
    estado: EstadoReserva;
    precioTotal: number;
    numeroHuespedes: number;
    observaciones?: string;
    motivoCancelacion?: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}
export interface ActualizarReservaDTO {
    estado?: EstadoReserva;
    observaciones?: string;
    motivoCancelacion?: string;
}
export interface ConfirmarReservaDTO {
    reservaId: string;
}
export interface CancelarReservaDTO {
    reservaId: string;
    motivo: string;
}
export interface CheckInDTO {
    reservaId: string;
}
export interface CheckOutDTO {
    reservaId: string;
}
export interface ConsultarReservaDTO {
    reservaId: string;
}
export interface ListarReservasDTO {
    clienteId?: string;
    habitacionId?: string;
    estado?: EstadoReserva;
    fechaInicio?: string;
    fechaFin?: string;
    limit?: number;
    offset?: number;
}
