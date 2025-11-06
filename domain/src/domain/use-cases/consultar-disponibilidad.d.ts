/**
 * Caso de Uso: Consultar Disponibilidad
 * Implementado como función pura siguiendo Clean Architecture
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";
export interface ConsultarDisponibilidadDTO {
    checkIn: string;
    checkOut: string;
    tipoHabitacion?: string;
    capacidadMinima?: number;
    precioMaximo?: number;
}
export interface HabitacionDisponibleDTO {
    id: string;
    numero: string;
    tipo: string;
    capacidad: number;
    precioBase: number;
    precioTotal: number;
    piso: number;
    vista: string;
    amenidades: string[];
}
export interface DisponibilidadDTO {
    habitaciones: HabitacionDisponibleDTO[];
    totalDisponibles: number;
    periodo: {
        checkIn: string;
        checkOut: string;
        duracionNoches: number;
    };
}
export interface ConsultarDisponibilidadDependencies {
    repositorioHabitaciones: RepositorioHabitaciones;
    servicioDisponibilidad: ServicioDisponibilidad;
    servicioPrecios: ServicioCalculoPrecio;
}
/**
 * Función pura para consultar disponibilidad
 */
export declare const consultarDisponibilidad: (command: ConsultarDisponibilidadDTO, dependencies: ConsultarDisponibilidadDependencies) => Promise<Result<DisponibilidadDTO, DomainError>>;
/**
 * Factory para crear el caso de uso con sus dependencias
 */
export declare const consultarDisponibilidadUseCase: (dependencies: ConsultarDisponibilidadDependencies) => (command: ConsultarDisponibilidadDTO) => Promise<Result<DisponibilidadDTO, DomainError>>;
