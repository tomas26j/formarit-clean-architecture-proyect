/**
 * Implementación funcional en memoria del RepositorioReservas
 * Esta implementación pertenece a la capa de infraestructura del backend
 */

import { RepositorioReservas } from "@hotel/domain/src/infrastructure/repositories/reserva-repository.js";
import { Reserva, EstadoReserva } from "@hotel/domain/src/domain/entities/reserva.js";
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, InfrastructureError } from "@hotel/domain/src/shared/types/domain-errors.js";

// Almacenamiento en memoria
const reservas: Map<string, Reserva> = new Map();

/**
 * Crea una implementación funcional del RepositorioReservas
 */
export const crearRepositorioReservas = (): RepositorioReservas => {
  /**
   * Guarda una reserva
   */
  const guardar = async (reserva: Reserva): Promise<Result<Reserva, DomainError>> => {
    try {
      reservas.set(reserva.id, reserva);
      return Result.success(reserva);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al guardar reserva: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca una reserva por ID
   */
  const buscarPorId = async (id: string): Promise<Result<Reserva | null, DomainError>> => {
    try {
      const reserva = reservas.get(id) || null;
      return Result.success(reserva);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar reserva por ID: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca reservas por cliente
   */
  const buscarPorCliente = async (clienteId: string): Promise<Result<Reserva[], DomainError>> => {
    try {
      const reservasCliente = Array.from(reservas.values()).filter(
        (reserva) => reserva.clienteId === clienteId
      );
      return Result.success(reservasCliente);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar reservas por cliente: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca reservas por habitación
   */
  const buscarPorHabitacion = async (
    habitacionId: string
  ): Promise<Result<Reserva[], DomainError>> => {
    try {
      const reservasHabitacion = Array.from(reservas.values()).filter(
        (reserva) => reserva.habitacionId === habitacionId
      );
      return Result.success(reservasHabitacion);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar reservas por habitación: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca reservas por estado
   */
  const buscarPorEstado = async (estado: string): Promise<Result<Reserva[], DomainError>> => {
    try {
      const reservasEstado = Array.from(reservas.values()).filter(
        (reserva) => reserva.estado === estado
      );
      return Result.success(reservasEstado);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar reservas por estado: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca reservas en un rango de fechas
   */
  const buscarPorRangoFechas = async (
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<Result<Reserva[], DomainError>> => {
    try {
      const reservasEnRango = Array.from(reservas.values()).filter((reserva) => {
        const checkIn = reserva.periodo.checkIn;
        const checkOut = reserva.periodo.checkOut;
        
        // Verificar si hay solapamiento con el rango solicitado
        return (
          (checkIn >= fechaInicio && checkIn <= fechaFin) ||
          (checkOut >= fechaInicio && checkOut <= fechaFin) ||
          (checkIn <= fechaInicio && checkOut >= fechaFin)
        );
      });
      
      return Result.success(reservasEnRango);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar reservas por rango de fechas: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Verifica si existe una reserva con el mismo ID
   */
  const existe = async (id: string): Promise<Result<boolean, DomainError>> => {
    try {
      return Result.success(reservas.has(id));
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar existencia de reserva: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Elimina una reserva
   */
  const eliminar = async (id: string): Promise<Result<void, DomainError>> => {
    try {
      reservas.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al eliminar reserva: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Lista todas las reservas con paginación
   */
  const listar = async (
    limit?: number,
    offset?: number
  ): Promise<Result<Reserva[], DomainError>> => {
    try {
      const todasReservas = Array.from(reservas.values());
      
      // Aplicar paginación si se especifica
      let resultado = todasReservas;
      if (offset !== undefined) {
        resultado = resultado.slice(offset);
      }
      if (limit !== undefined) {
        resultado = resultado.slice(0, limit);
      }
      
      return Result.success(resultado);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al listar reservas: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  // Retornar objeto que implementa la interfaz
  return {
    guardar,
    buscarPorId,
    buscarPorCliente,
    buscarPorHabitacion,
    buscarPorEstado,
    buscarPorRangoFechas,
    existe,
    eliminar,
    listar,
  };
};

