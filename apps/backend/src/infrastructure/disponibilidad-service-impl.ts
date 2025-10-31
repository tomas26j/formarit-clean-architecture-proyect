/**
 * Implementación funcional del ServicioDisponibilidad
 * Esta implementación pertenece a la capa de infraestructura del backend
 */

import { ServicioDisponibilidad } from "@hotel/domain/src/domain/services/disponibilidad-service.js";
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, EntityNotFoundError, InfrastructureError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { Periodo } from "@hotel/domain/src/shared/types/lapse.js";
import { RepositorioReservas } from "@hotel/domain/src/infrastructure/repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "@hotel/domain/src/infrastructure/repositories/habitacion-repository.js";
import { EstadoReserva } from "@hotel/domain/src/domain/entities/reserva.js";

/**
 * Dependencias requeridas por el servicio de disponibilidad
 */
export interface DisponibilidadServiceDependencies {
  repositorioReservas: RepositorioReservas;
  repositorioHabitaciones: RepositorioHabitaciones;
}

/**
 * Crea una implementación funcional del ServicioDisponibilidad
 */
export const crearServicioDisponibilidad = (
  deps: DisponibilidadServiceDependencies
): ServicioDisponibilidad => {
  /**
   * Verifica si dos períodos se solapan
   */
  const seSolapan = (periodo1: Periodo, periodo2: Periodo): boolean => {
    return periodo1.checkIn < periodo2.checkOut && periodo1.checkOut > periodo2.checkIn;
  };

  /**
   * Verifica si una habitación está disponible en un período específico
   */
  const verificarDisponibilidad = async (
    habitacionId: string,
    periodo: Periodo
  ): Promise<Result<boolean, DomainError>> => {
    try {
      // 1. Verificar que la habitación existe
      const habitacionResult = await deps.repositorioHabitaciones.buscarPorId(habitacionId);
      if (habitacionResult.isFailure()) {
        return Result.failure(habitacionResult.error);
      }

      const habitacion = habitacionResult.data;
      if (!habitacion) {
        return Result.failure(
          new EntityNotFoundError(`Habitación con ID ${habitacionId} no encontrada`)
        );
      }

      // 2. Verificar que la habitación esté activa
      if (!habitacion.activa) {
        return Result.success(false);
      }

      // 3. Buscar reservas existentes para la habitación
      const reservasResult = await deps.repositorioReservas.buscarPorHabitacion(habitacionId);
      if (reservasResult.isFailure()) {
        return Result.failure(reservasResult.error);
      }

      const reservas = reservasResult.data;

      // 4. Filtrar reservas activas (no canceladas, no completadas)
      const reservasActivas = reservas.filter(
        (reserva) =>
          reserva.estado !== EstadoReserva.CANCELADA &&
          reserva.estado !== EstadoReserva.CHECKOUT
      );

      // 5. Verificar si hay conflictos con el período solicitado
      const tieneConflictos = reservasActivas.some((reserva) =>
        seSolapan(periodo, reserva.periodo)
      );

      return Result.success(!tieneConflictos);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar disponibilidad: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Verifica la disponibilidad de múltiples habitaciones
   */
  const verificarDisponibilidadMultiple = async (
    habitacionIds: string[],
    periodo: Periodo
  ): Promise<Result<Record<string, boolean>, DomainError>> => {
    try {
      const resultados: Record<string, boolean> = {};

      // Verificar disponibilidad de cada habitación
      for (const habitacionId of habitacionIds) {
        const resultado = await verificarDisponibilidad(habitacionId, periodo);
        if (resultado.isFailure()) {
          return Result.failure(resultado.error);
        }
        resultados[habitacionId] = resultado.data;
      }

      return Result.success(resultados);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar disponibilidad múltiple: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca habitaciones disponibles en un período específico
   */
  const buscarHabitacionesDisponibles = async (
    periodo: Periodo,
    tipoHabitacion?: string
  ): Promise<Result<string[], DomainError>> => {
    try {
      // 1. Buscar todas las habitaciones activas
      const habitacionesResult = await deps.repositorioHabitaciones.buscarActivas();
      if (habitacionesResult.isFailure()) {
        return Result.failure(habitacionesResult.error);
      }

      let habitaciones = habitacionesResult.data;

      // 2. Filtrar por tipo si se especifica
      if (tipoHabitacion) {
        habitaciones = habitaciones.filter(
          (hab) => hab.tipo.id === tipoHabitacion || hab.tipo.nombre === tipoHabitacion
        );
      }

      // 3. Verificar disponibilidad de cada habitación
      const habitacionesDisponibles: string[] = [];

      for (const habitacion of habitaciones) {
        const disponibilidadResult = await verificarDisponibilidad(
          habitacion.id,
          periodo
        );
        if (disponibilidadResult.isFailure()) {
          return Result.failure(disponibilidadResult.error);
        }

        if (disponibilidadResult.data) {
          habitacionesDisponibles.push(habitacion.id);
        }
      }

      return Result.success(habitacionesDisponibles);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitaciones disponibles: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Verifica si hay conflictos de reservas
   */
  const verificarConflictosReservas = async (
    habitacionId: string,
    periodo: Periodo,
    excluirReservaId?: string
  ): Promise<Result<boolean, DomainError>> => {
    try {
      // 1. Buscar reservas existentes para la habitación
      const reservasResult = await deps.repositorioReservas.buscarPorHabitacion(habitacionId);
      if (reservasResult.isFailure()) {
        return Result.failure(reservasResult.error);
      }

      let reservas = reservasResult.data;

      // 2. Excluir la reserva especificada si se proporciona
      if (excluirReservaId) {
        reservas = reservas.filter((reserva) => reserva.id !== excluirReservaId);
      }

      // 3. Filtrar reservas activas
      const reservasActivas = reservas.filter(
        (reserva) =>
          reserva.estado !== EstadoReserva.CANCELADA &&
          reserva.estado !== EstadoReserva.CHECKOUT
      );

      // 4. Verificar si hay conflictos
      const tieneConflictos = reservasActivas.some((reserva) =>
        seSolapan(periodo, reserva.periodo)
      );

      return Result.success(tieneConflictos);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar conflictos de reservas: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  // Retornar objeto que implementa la interfaz
  return {
    verificarDisponibilidad,
    verificarDisponibilidadMultiple,
    buscarHabitacionesDisponibles,
    verificarConflictosReservas,
  };
};

