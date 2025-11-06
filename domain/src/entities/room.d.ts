import { Entity } from "../utils/types";
import { TipoHabitacion } from "../utils/types/room-type.js";
import { Precio } from "../utils/types/precio.js";
export interface Habitacion extends Entity {
    readonly numero: string;
    readonly tipo: TipoHabitacion;
    readonly precioBase: Precio;
    readonly activa: boolean;
    readonly piso: number;
    readonly vista: string;
    puedeReservarse(): boolean;
    calcularPrecioTotal(duracionNoches: number): Precio;
    desactivar(): Habitacion;
    activar(): Habitacion;
    cambiarPrecio(nuevoPrecio: Precio): Habitacion;
}
export declare class HabitacionImpl implements Habitacion {
    readonly id: string;
    readonly numero: string;
    readonly tipo: TipoHabitacion;
    readonly precioBase: Precio;
    readonly activa: boolean;
    readonly piso: number;
    readonly vista: string;
    constructor(id: string, numero: string, tipo: TipoHabitacion, precioBase: Precio, activa?: boolean, piso?: number, vista?: string);
    private validarHabitacion;
    puedeReservarse(): boolean;
    calcularPrecioTotal(duracionNoches: number): Precio;
    desactivar(): Habitacion;
    activar(): Habitacion;
    cambiarPrecio(nuevoPrecio: Precio): Habitacion;
    static crear(id: string, numero: string, tipo: TipoHabitacion, precioBase: Precio, piso?: number, vista?: string): Habitacion;
}
export type Room = Habitacion;
export declare const RoomImpl: typeof HabitacionImpl;
