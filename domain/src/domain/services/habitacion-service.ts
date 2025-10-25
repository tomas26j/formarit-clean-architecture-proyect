/**
 * Servicio de dominio para Habitación
 * Define las operaciones de negocio relacionadas con habitaciones
 */

import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Habitacion } from "../entities/habitacion.js";
import { Precio } from "../../shared/types/precio.js";

export interface HabitacionService {
  /**
   * Valida si una habitación puede ser creada
   */
  validarCreacionHabitacion(
    numero: string,
    tipoId: string,
    precioBase: Precio,
    piso: number
  ): Result<boolean, DomainError>;

  /**
   * Valida si una habitación puede ser reservada
   */
  validarReservacionHabitacion(habitacion: Habitacion): Result<boolean, DomainError>;

  /**
   * Valida si una habitación puede ser desactivada
   */
  validarDesactivacionHabitacion(habitacion: Habitacion): Result<boolean, DomainError>;

  /**
   * Valida si una habitación puede ser activada
   */
  validarActivacionHabitacion(habitacion: Habitacion): Result<boolean, DomainError>;

  /**
   * Calcula el precio total para una duración específica
   */
  calcularPrecioTotal(habitacion: Habitacion, duracionNoches: number): Result<Precio, DomainError>;

  /**
   * Verifica si una habitación puede alojar un número específico de huéspedes
   */
  puedeAlojarHuespedes(habitacion: Habitacion, numeroHuespedes: number): Result<boolean, DomainError>;

  /**
   * Crea una nueva habitación
   */
  crearHabitacion(
    id: string,
    numero: string,
    tipo: any, // TipoHabitacion
    precioBase: Precio,
    piso: number,
    vista: string
  ): Result<Habitacion, DomainError>;

  /**
   * Desactiva una habitación
   */
  desactivarHabitacion(habitacion: Habitacion): Result<Habitacion, DomainError>;

  /**
   * Activa una habitación
   */
  activarHabitacion(habitacion: Habitacion): Result<Habitacion, DomainError>;

  /**
   * Cambia el precio de una habitación
   */
  cambiarPrecioHabitacion(habitacion: Habitacion, nuevoPrecio: Precio): Result<Habitacion, DomainError>;
}
