/**
 * Caso de Uso: Cancelar Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";
export interface CancelarReservaDTO {
    reservaId: string;
    motivo: string;
    canceladoPor: string;
}
export interface ReservaCanceladaDTO {
    reservaId: string;
    estado: string;
    canceladaEn: string;
    motivo: string;
    canceladoPor: string;
    penalizacion: {
        aplicada: boolean;
        monto: number;
        porcentaje: number;
    };
    reembolso: {
        monto: number;
        metodo: string;
    };
}
export interface CancelarReservaDependencies {
    repositorioReservas: RepositorioReservas;
    servicioPrecios: ServicioCalculoPrecio;
}
/**
 * Función pura para cancelar una reserva
 */
export declare const cancelarReserva: (command: CancelarReservaDTO, dependencies: CancelarReservaDependencies) => Promise<Result<ReservaCanceladaDTO, DomainError>>;
/**
 * Factory para crear el caso de uso con sus dependencias
 */
export declare const cancelarReservaUseCase: (dependencies: CancelarReservaDependencies) => (command: CancelarReservaDTO) => Promise<Result<ReservaCanceladaDTO, DomainError>>;
