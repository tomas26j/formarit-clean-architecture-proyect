import { Habitacion } from "../entities/room.js";
import { Periodo } from "../utils/types/lapse.js";
import { Precio } from "../utils/types/precio.js";
export interface ServicioCalculoPrecio {
    calcularPrecio(habitacion: Habitacion, periodo: Periodo): Precio;
    calcularPrecioConDescuento(habitacion: Habitacion, periodo: Periodo, descuento: number): Precio;
    calcularPrecioTemporada(habitacion: Habitacion, periodo: Periodo, factorTemporada: number): Precio;
    calcularPrecioGrupo(habitacion: Habitacion, periodo: Periodo, numeroHuespedes: number): Precio;
}
export declare class ServicioCalculoPrecioImpl implements ServicioCalculoPrecio {
    calcularPrecio(habitacion: Habitacion, periodo: Periodo): Precio;
    calcularPrecioConDescuento(habitacion: Habitacion, periodo: Periodo, descuento: number): Precio;
    calcularPrecioTemporada(habitacion: Habitacion, periodo: Periodo, factorTemporada: number): Precio;
    calcularPrecioGrupo(habitacion: Habitacion, periodo: Periodo, numeroHuespedes: number): Precio;
    determinarFactorTemporada(periodo: Periodo): number;
    calcularDescuentoPorDuracion(duracionNoches: number): number;
}
