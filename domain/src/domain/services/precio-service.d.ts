/**
 * Servicio de dominio para cálculo de precios
 * Define las operaciones de negocio relacionadas con precios
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Habitacion } from "../entities/habitacion.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";
export interface ServicioCalculoPrecio {
    /**
     * Calcula el precio total para una habitación en un período específico
     */
    calcularPrecio(habitacion: Habitacion, periodo: Periodo): Result<Precio, DomainError>;
    /**
     * Calcula el precio con descuentos aplicados
     */
    calcularPrecioConDescuento(habitacion: Habitacion, periodo: Periodo, descuento: number): Result<Precio, DomainError>;
    /**
     * Calcula el precio con impuestos
     */
    calcularPrecioConImpuestos(precioBase: Precio, porcentajeImpuestos: number): Result<Precio, DomainError>;
    /**
     * Calcula el precio por noche
     */
    calcularPrecioPorNoche(habitacion: Habitacion, fecha: Date): Result<Precio, DomainError>;
    /**
     * Aplica descuentos estacionales
     */
    aplicarDescuentoEstacional(precio: Precio, fecha: Date): Result<Precio, DomainError>;
    /**
     * Calcula penalizaciones por cancelación
     */
    calcularPenalizacionCancelacion(precio: Precio, diasAntesCheckIn: number): Result<Precio, DomainError>;
}
