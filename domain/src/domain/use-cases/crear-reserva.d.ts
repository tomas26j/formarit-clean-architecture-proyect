/**
 * Caso de Uso: Crear Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { CrearReservaDTO, ReservaDTO } from "../../application/dtos/reserva-dto.js";
import { ReservaService } from "../services/reserva-service.js";
import { ReservaValidator } from "../../application/validators/reserva-validator.js";
import { ReservaMapper } from "../../application/mappers/reserva-mapper.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service";
export interface CrearReservaDependencies {
    reservaService: ReservaService;
    reservaValidator: ReservaValidator;
    reservaMapper: ReservaMapper;
    repositorioReservas: RepositorioReservas;
    repositorioHabitaciones: RepositorioHabitaciones;
    servicioDisponibilidad: ServicioDisponibilidad;
    servicioPrecios: ServicioCalculoPrecio;
    generarId: () => string;
}
/**
 * Función pura para crear una reserva
 * No tiene efectos secundarios y es completamente testeable
 */
export declare const crearReserva: (command: CrearReservaDTO, dependencies: CrearReservaDependencies) => Promise<Result<ReservaDTO, DomainError>>;
/**
 * Factory para crear el caso de uso con sus dependencias
 */
export declare const crearReservaUseCase: (dependencies: CrearReservaDependencies) => (command: CrearReservaDTO) => Promise<Result<ReservaDTO, DomainError>>;
