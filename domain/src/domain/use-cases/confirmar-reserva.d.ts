/**
 * Caso de Uso: Confirmar Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
export interface ConfirmarReservaDTO {
    reservaId: string;
    metodoPago: string;
    numeroTarjeta?: string;
    codigoSeguridad?: string;
    fechaVencimiento?: string;
}
export interface ReservaConfirmadaDTO {
    reservaId: string;
    estado: string;
    confirmadaEn: string;
    metodoPago: string;
    precioTotal: number;
    periodo: {
        checkIn: string;
        checkOut: string;
    };
}
export interface ConfirmarReservaDependencies {
    repositorioReservas: RepositorioReservas;
    repositorioHabitaciones: RepositorioHabitaciones;
    servicioDisponibilidad: ServicioDisponibilidad;
}
/**
 * Función pura para confirmar una reserva
 */
export declare const confirmarReserva: (command: ConfirmarReservaDTO, dependencies: ConfirmarReservaDependencies) => Promise<Result<ReservaConfirmadaDTO, DomainError>>;
/**
 * Factory para crear el caso de uso con sus dependencias
 */
export declare const confirmarReservaUseCase: (dependencies: ConfirmarReservaDependencies) => (command: ConfirmarReservaDTO) => Promise<Result<ReservaConfirmadaDTO, DomainError>>;
