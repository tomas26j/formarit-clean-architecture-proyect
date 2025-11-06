/**
 * Implementación funcional del servicio de dominio para Reserva
 * Contiene toda la lógica de negocio relacionada con reservas
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Reserva } from "../../domain/entities/reserva.js";
import { ReservaService } from "../../domain/services/reserva-service.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";
/**
 * Valida si una reserva puede ser creada
 */
export declare const validarCreacionReserva: (habitacionId: string, clienteId: string, periodo: Periodo, numeroHuespedes: number) => Result<boolean, DomainError>;
/**
 * Valida si una reserva puede ser confirmada
 */
export declare const validarConfirmacionReserva: (reserva: Reserva) => Result<boolean, DomainError>;
/**
 * Valida si una reserva puede ser cancelada
 */
export declare const validarCancelacionReserva: (reserva: Reserva, motivo: string) => Result<boolean, DomainError>;
/**
 * Valida si una reserva puede hacer check-in
 */
export declare const validarCheckIn: (reserva: Reserva) => Result<boolean, DomainError>;
/**
 * Valida si una reserva puede hacer check-out
 */
export declare const validarCheckOut: (reserva: Reserva) => Result<boolean, DomainError>;
/**
 * Calcula la penalización por cancelación
 */
export declare const calcularPenalizacionCancelacion: (reserva: Reserva) => Result<Precio, DomainError>;
/**
 * Verifica si una reserva puede ser modificada
 */
export declare const puedeModificarse: (reserva: Reserva) => Result<boolean, DomainError>;
/**
 * Crea una nueva reserva con estado pendiente
 */
export declare const crearReserva: (id: string, habitacionId: string, clienteId: string, periodo: Periodo, precioTotal: Precio, numeroHuespedes: number, observaciones?: string) => Result<Reserva, DomainError>;
/**
 * Confirma una reserva
 */
export declare const confirmarReserva: (reserva: Reserva) => Result<Reserva, DomainError>;
/**
 * Cancela una reserva
 */
export declare const cancelarReserva: (reserva: Reserva, motivo: string) => Result<Reserva, DomainError>;
/**
 * Realiza check-in de una reserva
 */
export declare const realizarCheckIn: (reserva: Reserva) => Result<Reserva, DomainError>;
/**
 * Realiza check-out de una reserva
 */
export declare const realizarCheckOut: (reserva: Reserva) => Result<Reserva, DomainError>;
/**
 * Crea una implementación funcional del ReservaService
 * Retorna un objeto que implementa la interfaz ReservaService usando funciones puras
 */
export declare const crearReservaService: () => ReservaService;
/**
 * @deprecated Usar las funciones exportadas directamente o crearReservaService()
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export declare class ReservaServiceImpl implements ReservaService {
    validarCreacionReserva: (habitacionId: string, clienteId: string, periodo: Periodo, numeroHuespedes: number) => Result<boolean, DomainError>;
    validarConfirmacionReserva: (reserva: Reserva) => Result<boolean, DomainError>;
    validarCancelacionReserva: (reserva: Reserva, motivo: string) => Result<boolean, DomainError>;
    validarCheckIn: (reserva: Reserva) => Result<boolean, DomainError>;
    validarCheckOut: (reserva: Reserva) => Result<boolean, DomainError>;
    calcularPenalizacionCancelacion: (reserva: Reserva) => Result<Precio, DomainError>;
    puedeModificarse: (reserva: Reserva) => Result<boolean, DomainError>;
    crearReserva: (id: string, habitacionId: string, clienteId: string, periodo: Periodo, precioTotal: Precio, numeroHuespedes: number, observaciones?: string) => Result<Reserva, DomainError>;
    confirmarReserva: (reserva: Reserva) => Result<Reserva, DomainError>;
    cancelarReserva: (reserva: Reserva, motivo: string) => Result<Reserva, DomainError>;
    realizarCheckIn: (reserva: Reserva) => Result<Reserva, DomainError>;
    realizarCheckOut: (reserva: Reserva) => Result<Reserva, DomainError>;
}
