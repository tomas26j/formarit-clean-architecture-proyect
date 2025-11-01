/**
 * Caso de Uso: Cancelar Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */

import { Result } from "../../shared/types/result.js";
import { DomainError, ValidationError, BusinessRuleError, EntityNotFoundError } from "../../shared/types/domain-errors.js";
import { Reserva, EstadoReserva } from "../entities/reserva.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";

// DTOs para el caso de uso
export interface CancelarReservaDTO {
  reservaId: string;
  motivo: string;
  canceladoPor: string; // ID del usuario que cancela
}

export interface ReservaCanceladaDTO {
  reservaId: string;
  estado: string;
  canceladaEn: string;
  motivo: string;
  canceladoPor: string;
  penalizacion: {
    aplicada: boolean;
    monto: number;
    porcentaje: number;
  };
  reembolso: {
    monto: number;
    metodo: string;
  };
}

// Dependencias del caso de uso
export interface CancelarReservaDependencies {
  repositorioReservas: RepositorioReservas;
  servicioPrecios: ServicioCalculoPrecio;
}

/**
 * Función pura para cancelar una reserva
 */
export const cancelarReserva = async (
  command: CancelarReservaDTO,
  dependencies: CancelarReservaDependencies
): Promise<Result<ReservaCanceladaDTO, DomainError>> => {
  // 1. Validar datos de entrada
  const validacion = validarCommand(command);
  if (validacion.isFailure()) {
    return Result.failure(validacion.error);
  }

  // 2. Buscar la reserva
  const reservaResult = await dependencies.repositorioReservas.buscarPorId(command.reservaId);
  if (reservaResult.isFailure()) {
    return Result.failure(reservaResult.error);
  }

  const reserva = reservaResult.data;
  if (!reserva) {
    return Result.failure(new EntityNotFoundError(`Reserva con ID ${command.reservaId} no encontrada`));
  }

  // 3. Verificar que la reserva puede cancelarse
  const puedeCancelarse = puedeCancelarReserva(reserva);
  if (!puedeCancelarse) {
    return Result.failure(
      new BusinessRuleError(`Esta reserva no puede cancelarse en su estado actual: ${reserva.estado}`)
    );
  }

  // 4. Calcular días antes del check-in para determinar penalización
  const ahora = new Date();
  const diasAntesCheckIn = Math.ceil(
    (reserva.periodo.checkIn.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 5. Calcular penalización
  const penalizacionResult = dependencies.servicioPrecios.calcularPenalizacionCancelacion(
    reserva.precioTotal,
    diasAntesCheckIn
  );

  if (penalizacionResult.isFailure()) {
    return Result.failure(penalizacionResult.error);
  }

  const penalizacion = penalizacionResult.data;

  // 6. Crear la reserva cancelada (nueva instancia con estado actualizado)
  const reservaCancelada: Reserva = {
    ...reserva,
    estado: EstadoReserva.CANCELADA,
    motivoCancelacion: command.motivo,
    fechaActualizacion: new Date(),
  };

  // 7. Guardar la reserva cancelada
  const guardarResult = await dependencies.repositorioReservas.guardar(reservaCancelada);
  if (guardarResult.isFailure()) {
    return Result.failure(guardarResult.error);
  }

  // 8. Calcular reembolso
  const montoReembolso = Math.max(0, reserva.precioTotal.valor - penalizacion.valor);
  const porcentajePenalizacion = reserva.precioTotal.valor > 0
    ? Math.round((penalizacion.valor / reserva.precioTotal.valor) * 100)
    : 0;

  // 9. Retornar respuesta
  return Result.success({
    reservaId: reservaCancelada.id,
    estado: reservaCancelada.estado,
    canceladaEn: reservaCancelada.fechaActualizacion.toISOString(),
    motivo: command.motivo,
    canceladoPor: command.canceladoPor,
    penalizacion: {
      aplicada: penalizacion.valor > 0,
      monto: penalizacion.valor,
      porcentaje: porcentajePenalizacion,
    },
    reembolso: {
      monto: montoReembolso,
      metodo: 'mismo_metodo_pago', // En una implementación real, esto vendría de la reserva
    },
  });
};

/**
 * Verifica si una reserva puede cancelarse
 */
const puedeCancelarReserva = (reserva: Reserva): boolean => {
  // Solo se pueden cancelar reservas pendientes o confirmadas
  return reserva.estado === EstadoReserva.PENDIENTE || reserva.estado === EstadoReserva.CONFIRMADA;
};

/**
 * Valida el comando de cancelación de reserva
 */
const validarCommand = (command: CancelarReservaDTO): Result<boolean, ValidationError> => {
  if (!command.reservaId || command.reservaId.trim().length === 0) {
    return Result.failure(new ValidationError('El ID de reserva es requerido'));
  }

  if (!command.motivo || command.motivo.trim().length === 0) {
    return Result.failure(new ValidationError('El motivo de cancelación es requerido'));
  }

  if (!command.canceladoPor || command.canceladoPor.trim().length === 0) {
    return Result.failure(new ValidationError('El ID del usuario que cancela es requerido'));
  }

  // Validar longitud mínima del motivo
  if (command.motivo.trim().length < 10) {
    return Result.failure(new ValidationError('El motivo de cancelación debe tener al menos 10 caracteres'));
  }

  return Result.success(true);
};

/**
 * Factory para crear el caso de uso con sus dependencias
 */
export const cancelarReservaUseCase = (dependencies: CancelarReservaDependencies) => {
  return (command: CancelarReservaDTO) => cancelarReserva(command, dependencies);
};

