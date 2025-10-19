import { Entity } from "../utils/types";
import { Lapse } from "../utils/types/lapse";

export interface Reservation extends Entity{
    roomId: string;
    clientId: string;
    lapse: Lapse;
    status: ReservationStatus;
    totalPrice: number;
}

type ReservationStatus = (typeof EstadoReserva)[keyof typeof EstadoReserva]

const EstadoReserva = {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    CHECKIN: 'checkin',
    CHECKOUT: 'checkout',
    CANCELADA: 'cancelada'
} as const;