/**
 * Servicio de dominio para Reserva
 * Define las operaciones de negocio relacionadas con reservas
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Reserva } from "../entities/reserva.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";
export interface ReservaService {
    /**
     * Valida si una reserva puede ser creada
     */
    validarCreacionReserva(habitacionId: string, clienteId: string, periodo: Periodo, numeroHuespedes: number): Result<boolean, DomainError>;
    /**
     * Valida si una reserva puede ser confirmada
     */
    validarConfirmacionReserva(reserva: Reserva): Result<boolean, DomainError>;
    /**
     * Valida si una reserva puede ser cancelada
     */
    validarCancelacionReserva(reserva: Reserva, motivo: string): Result<boolean, DomainError>;
    /**
     * Valida si una reserva puede hacer check-in
     */
    validarCheckIn(reserva: Reserva): Result<boolean, DomainError>;
    /**
     * Valida si una reserva puede hacer check-out
     */
    validarCheckOut(reserva: Reserva): Result<boolean, DomainError>;
    /**
     * Calcula la penalización por cancelación
     */
    calcularPenalizacionCancelacion(reserva: Reserva): Result<Precio, DomainError>;
    /**
     * Verifica si una reserva puede ser modificada
     */
    puedeModificarse(reserva: Reserva): Result<boolean, DomainError>;
    /**
     * Crea una nueva reserva con estado pendiente
     */
    crearReserva(id: string, habitacionId: string, clienteId: string, periodo: Periodo, precioTotal: Precio, numeroHuespedes: number, observaciones?: string): Result<Reserva, DomainError>;
    /**
     * Confirma una reserva
     */
    confirmarReserva(reserva: Reserva): Result<Reserva, DomainError>;
    /**
     * Cancela una reserva
     */
    cancelarReserva(reserva: Reserva, motivo: string): Result<Reserva, DomainError>;
    /**
     * Realiza check-in de una reserva
     */
    realizarCheckIn(reserva: Reserva): Result<Reserva, DomainError>;
    /**
     * Realiza check-out de una reserva
     */
    realizarCheckOut(reserva: Reserva): Result<Reserva, DomainError>;
}
