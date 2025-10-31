/**
 * Servicio de dominio para verificar disponibilidad
 * Define las operaciones de negocio relacionadas con disponibilidad
 */

import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { Periodo } from "@hotel/domain/src/shared/types/lapse.js";

export interface ServicioDisponibilidad {
  /**
   * Verifica si una habitación está disponible en un período específico
   */
  verificarDisponibilidad(
    habitacionId: string,
    periodo: Periodo
  ): Promise<Result<boolean, DomainError>>;

  /**
   * Verifica la disponibilidad de múltiples habitaciones
   */
  verificarDisponibilidadMultiple(
    habitacionIds: string[],
    periodo: Periodo
  ): Promise<Result<Record<string, boolean>, DomainError>>;

  /**
   * Busca habitaciones disponibles en un período específico
   */
  buscarHabitacionesDisponibles(
    periodo: Periodo,
    tipoHabitacion?: string
  ): Promise<Result<string[], DomainError>>;

  /**
   * Verifica si hay conflictos de reservas
   */
  verificarConflictosReservas(
    habitacionId: string,
    periodo: Periodo,
    excluirReservaId?: string
  ): Promise<Result<boolean, DomainError>>;
}
