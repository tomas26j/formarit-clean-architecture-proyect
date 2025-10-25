/**
 * Repositorio para la entidad Reserva
 * Define las operaciones de persistencia
 */

import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Reserva } from "../../domain/entities/reserva.js";
import { ReservaSchema } from "../../domain/schemas/reserva-schema.js";

export interface RepositorioReservas {
  /**
   * Guarda una reserva
   */
  guardar(reserva: Reserva): Promise<Result<Reserva, DomainError>>;

  /**
   * Busca una reserva por ID
   */
  buscarPorId(id: string): Promise<Result<Reserva | null, DomainError>>;

  /**
   * Busca reservas por cliente
   */
  buscarPorCliente(clienteId: string): Promise<Result<Reserva[], DomainError>>;

  /**
   * Busca reservas por habitación
   */
  buscarPorHabitacion(habitacionId: string): Promise<Result<Reserva[], DomainError>>;

  /**
   * Busca reservas por estado
   */
  buscarPorEstado(estado: string): Promise<Result<Reserva[], DomainError>>;

  /**
   * Busca reservas en un rango de fechas
   */
  buscarPorRangoFechas(
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<Result<Reserva[], DomainError>>;

  /**
   * Verifica si existe una reserva con el mismo ID
   */
  existe(id: string): Promise<Result<boolean, DomainError>>;

  /**
   * Elimina una reserva
   */
  eliminar(id: string): Promise<Result<void, DomainError>>;

  /**
   * Lista todas las reservas con paginación
   */
  listar(
    limit?: number,
    offset?: number
  ): Promise<Result<Reserva[], DomainError>>;
}
