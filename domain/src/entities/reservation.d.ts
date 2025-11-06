import { Entity } from "../utils/types";
import { Periodo } from "../utils/types/lapse.js";
import { Precio } from "../utils/types/precio.js";
export declare enum EstadoReserva {
    PENDIENTE = "pendiente",
    CONFIRMADA = "confirmada",
    CHECKIN = "checkin",
    CHECKOUT = "checkout",
    CANCELADA = "cancelada"
}
export interface Reserva extends Entity {
    readonly habitacionId: string;
    readonly clienteId: string;
    readonly periodo: Periodo;
    readonly estado: EstadoReserva;
    readonly precioTotal: Precio;
    readonly numeroHuespedes: number;
    readonly observaciones?: string;
    confirmar(): Reserva;
    cancelar(motivo: string): Reserva;
    realizarCheckIn(): Reserva;
    realizarCheckOut(): Reserva;
    puedeCancelarse(): boolean;
    puedeModificarse(): boolean;
    calcularPenalizacionCancelacion(): Precio;
}
export declare class ReservaImpl implements Reserva {
    readonly id: string;
    readonly habitacionId: string;
    readonly clienteId: string;
    readonly periodo: Periodo;
    readonly estado: EstadoReserva;
    readonly precioTotal: Precio;
    readonly numeroHuespedes: number;
    readonly observaciones?: string | undefined;
    constructor(id: string, habitacionId: string, clienteId: string, periodo: Periodo, estado: EstadoReserva, precioTotal: Precio, numeroHuespedes?: number, observaciones?: string | undefined);
    private validarReserva;
    confirmar(): Reserva;
    cancelar(motivo: string): Reserva;
    realizarCheckIn(): Reserva;
    realizarCheckOut(): Reserva;
    puedeCancelarse(): boolean;
    puedeModificarse(): boolean;
    calcularPenalizacionCancelacion(): Precio;
    static crear(id: string, habitacionId: string, clienteId: string, periodo: Periodo, precioTotal: Precio, numeroHuespedes?: number, observaciones?: string): Reserva;
}
export type Reservation = Reserva;
export declare const ReservationImpl: typeof ReservaImpl;
