/**
 * Caso de Uso: Confirmar Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */

import { Result } from "../../shared/types/result.js";
import { DomainError, ValidationError, BusinessRuleError, EntityNotFoundError } from "../../shared/types/domain-errors.js";
import { Reserva, EstadoReserva } from "../entities/reserva.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";

// Importar DTOs desde la capa de aplicación si existen, sino usar estos
// DTOs para el caso de uso
export interface ConfirmarReservaDTO {
  reservaId: string;
  metodoPago: string;
  numeroTarjeta?: string;
  codigoSeguridad?: string;
  fechaVencimiento?: string;
}

export interface ReservaConfirmadaDTO {
  reservaId: string;
  estado: string;
  confirmadaEn: string;
  metodoPago: string;
  precioTotal: number;
  periodo: {
    checkIn: string;
    checkOut: string;
  };
}

// Dependencias del caso de uso
export interface ConfirmarReservaDependencies {
  repositorioReservas: RepositorioReservas;
  repositorioHabitaciones: RepositorioHabitaciones;
  servicioDisponibilidad: ServicioDisponibilidad;
}

/**
 * Función pura para confirmar una reserva
 */
export const confirmarReserva = async (
  command: ConfirmarReservaDTO,
  dependencies: ConfirmarReservaDependencies
): Promise<Result<ReservaConfirmadaDTO, DomainError>> => {
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

  // 3. Verificar que la reserva puede confirmarse
  if (reserva.estado !== EstadoReserva.PENDIENTE) {
    return Result.failure(
      new BusinessRuleError(`Solo las reservas pendientes pueden confirmarse. Estado actual: ${reserva.estado}`)
    );
  }

  // 4. Verificar disponibilidad nuevamente (por posibles cambios)
  const disponibilidadResult = await dependencies.servicioDisponibilidad.verificarConflictosReservas(
    reserva.habitacionId,
    reserva.periodo,
    reserva.id // Excluir la propia reserva
  );

  if (disponibilidadResult.isFailure()) {
    return Result.failure(disponibilidadResult.error);
  }

  if (disponibilidadResult.data) {
    return Result.failure(
      new BusinessRuleError('La habitación ya no está disponible para las fechas de la reserva')
    );
  }

  // 5. Validar método de pago
  const validacionPago = validarMetodoPago(command);
  if (validacionPago.isFailure()) {
    return Result.failure(validacionPago.error);
  }

  // 6. Crear la reserva confirmada (nueva instancia con estado actualizado)
  const reservaConfirmada: Reserva = {
    ...reserva,
    estado: EstadoReserva.CONFIRMADA,
    fechaActualizacion: new Date(),
  };

  // 7. Guardar la reserva confirmada
  const guardarResult = await dependencies.repositorioReservas.guardar(reservaConfirmada);
  if (guardarResult.isFailure()) {
    return Result.failure(guardarResult.error);
  }

  // 8. Retornar respuesta
  return Result.success({
    reservaId: reservaConfirmada.id,
    estado: reservaConfirmada.estado,
    confirmadaEn: reservaConfirmada.fechaActualizacion.toISOString(),
    metodoPago: command.metodoPago,
    precioTotal: reservaConfirmada.precioTotal.valor,
    periodo: {
      checkIn: reservaConfirmada.periodo.checkIn.toISOString(),
      checkOut: reservaConfirmada.periodo.checkOut.toISOString(),
    },
  });
};

/**
 * Valida el comando de confirmación de reserva
 */
const validarCommand = (command: ConfirmarReservaDTO): Result<boolean, ValidationError> => {
  if (!command.reservaId || command.reservaId.trim().length === 0) {
    return Result.failure(new ValidationError('El ID de reserva es requerido'));
  }

  if (!command.metodoPago || command.metodoPago.trim().length === 0) {
    return Result.failure(new ValidationError('El método de pago es requerido'));
  }

  // Validar métodos de pago válidos
  const metodosValidos = ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo'];
  if (!metodosValidos.includes(command.metodoPago)) {
    return Result.failure(new ValidationError(`Método de pago no válido. Métodos válidos: ${metodosValidos.join(', ')}`));
  }

  return Result.success(true);
};

/**
 * Valida el método de pago y sus datos relacionados
 */
const validarMetodoPago = (command: ConfirmarReservaDTO): Result<boolean, ValidationError> => {
  if (command.metodoPago === 'tarjeta_credito' || command.metodoPago === 'tarjeta_debito') {
    if (!command.numeroTarjeta || command.numeroTarjeta.trim().length === 0) {
      return Result.failure(new ValidationError('El número de tarjeta es requerido para pagos con tarjeta'));
    }

    if (!command.codigoSeguridad || command.codigoSeguridad.trim().length === 0) {
      return Result.failure(new ValidationError('El código de seguridad es requerido para pagos con tarjeta'));
    }

    if (!command.fechaVencimiento || command.fechaVencimiento.trim().length === 0) {
      return Result.failure(new ValidationError('La fecha de vencimiento es requerida para pagos con tarjeta'));
    }

    // Validar formato del número de tarjeta (básico)
    const numeroTarjetaLimpio = command.numeroTarjeta.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(numeroTarjetaLimpio)) {
      return Result.failure(new ValidationError('El número de tarjeta debe tener entre 13 y 19 dígitos'));
    }

    // Validar código de seguridad
    if (!/^\d{3,4}$/.test(command.codigoSeguridad)) {
      return Result.failure(new ValidationError('El código de seguridad debe tener 3 o 4 dígitos'));
    }

    // Validar fecha de vencimiento
    const fechaVencimiento = new Date(command.fechaVencimiento);
    if (isNaN(fechaVencimiento.getTime()) || fechaVencimiento < new Date()) {
      return Result.failure(new ValidationError('La fecha de vencimiento debe ser válida y futura'));
    }
  }

  return Result.success(true);
};

/**
 * Factory para crear el caso de uso con sus dependencias
 */
export const confirmarReservaUseCase = (dependencies: ConfirmarReservaDependencies) => {
  return (command: ConfirmarReservaDTO) => confirmarReserva(command, dependencies);
};

