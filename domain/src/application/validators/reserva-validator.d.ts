/**
 * Validadores para DTOs de Reserva
 * Centraliza todas las validaciones de entrada
 */
import { Result } from "../../shared/types/result.js";
import { ValidationError } from "../../shared/types/domain-errors.js";
import { CrearReservaDTO, ActualizarReservaDTO, CancelarReservaDTO } from "../dtos/reserva-dto";
export interface ReservaValidator {
    validarCrearReserva(dto: CrearReservaDTO): Result<boolean, ValidationError>;
    validarActualizarReserva(dto: ActualizarReservaDTO): Result<boolean, ValidationError>;
    validarCancelarReserva(dto: CancelarReservaDTO): Result<boolean, ValidationError>;
    validarIdReserva(id: string): Result<boolean, ValidationError>;
    validarFechas(checkIn: string, checkOut: string): Result<boolean, ValidationError>;
    validarNumeroHuespedes(numero: number): Result<boolean, ValidationError>;
}
/**
 * Valida los datos para crear una reserva
 */
export declare const validarCrearReserva: (dto: CrearReservaDTO) => Result<boolean, ValidationError>;
/**
 * Valida los datos para actualizar una reserva
 */
export declare const validarActualizarReserva: (dto: ActualizarReservaDTO) => Result<boolean, ValidationError>;
/**
 * Valida los datos para cancelar una reserva
 */
export declare const validarCancelarReserva: (dto: CancelarReservaDTO) => Result<boolean, ValidationError>;
/**
 * Valida el ID de una reserva
 */
export declare const validarIdReserva: (id: string) => Result<boolean, ValidationError>;
/**
 * Valida las fechas de check-in y check-out
 */
export declare const validarFechas: (checkIn: string, checkOut: string) => Result<boolean, ValidationError>;
/**
 * Valida el número de huéspedes
 */
export declare const validarNumeroHuespedes: (numero: number) => Result<boolean, ValidationError>;
/**
 * Crea una implementación funcional del ReservaValidator
 * Retorna un objeto que implementa la interfaz ReservaValidator usando funciones puras
 */
export declare const crearReservaValidator: () => ReservaValidator;
/**
 * @deprecated Usar las funciones exportadas directamente o crearReservaValidator()
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export declare class ReservaValidatorImpl implements ReservaValidator {
    validarCrearReserva: (dto: CrearReservaDTO) => Result<boolean, ValidationError>;
    validarActualizarReserva: (dto: ActualizarReservaDTO) => Result<boolean, ValidationError>;
    validarCancelarReserva: (dto: CancelarReservaDTO) => Result<boolean, ValidationError>;
    validarIdReserva: (id: string) => Result<boolean, ValidationError>;
    validarFechas: (checkIn: string, checkOut: string) => Result<boolean, ValidationError>;
    validarNumeroHuespedes: (numero: number) => Result<boolean, ValidationError>;
}
