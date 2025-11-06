/**
 * Entidad de dominio: Habitación
 * Interface pura sin lógica de negocio
 */
import { Entity } from "../../shared/types/entity.js";
import { TipoHabitacion } from "../../shared/types/room-type.js";
import { Precio } from "../../shared/types/precio.js";
/**
 * Entidad de dominio Habitación
 * Representa una habitación en el hotel
 */
export interface Habitacion extends Entity {
    readonly numero: string;
    readonly tipo: TipoHabitacion;
    readonly precioBase: Precio;
    readonly activa: boolean;
    readonly piso: number;
    readonly vista: string;
}
/**
 * Value Object para identificar una habitación
 */
export interface HabitacionId {
    readonly value: string;
}
/**
 * Value Object para el estado de una habitación
 */
export interface EstadoHabitacionVO {
    value: boolean;
    puedeReservarse(): boolean;
    puedeDesactivarse(): boolean;
    puedeActivarse(): boolean;
}
