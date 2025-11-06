/**
 * Entidad de dominio: Reserva
 * Interface pura sin lógica de negocio
 */
import { Entity } from "../../shared/types/entity.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";
export declare enum EstadoReserva {
    PENDIENTE = "pendiente",
    CONFIRMADA = "confirmada",
    CHECKIN = "checkin",
    CHECKOUT = "checkout",
    CANCELADA = "cancelada"
}
/**
 * Entidad de dominio Reserva
 * Representa una reserva de habitación en el sistema
 */
export interface Reserva extends Entity {
    readonly habitacionId: string;
    readonly clienteId: string;
    readonly periodo: Periodo;
    readonly estado: EstadoReserva;
    readonly precioTotal: Precio;
    readonly numeroHuespedes: number;
    readonly observaciones?: string;
    readonly motivoCancelacion?: string;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}
/**
 * Value Object para identificar una reserva
 */
export interface ReservaId {
    readonly value: string;
}
/**
 * Value Object para el estado de una reserva
 */
export interface EstadoReservaVO {
    value: EstadoReserva;
    puedeCancelarse(): boolean;
    puedeModificarse(): boolean;
    puedeHacerCheckIn(): boolean;
    puedeHacerCheckOut(): boolean;
}
