/**
 * Implementación del servicio de dominio para Reserva
 * Contiene toda la lógica de negocio relacionada con reservas
 */

import { Result } from "../../shared/types/result.js";
import { 
  DomainError, 
  ValidationError, 
  BusinessRuleError,
  InvalidReservationStateError 
} from "../../shared/types/domain-errors.js";
import { Reserva, EstadoReserva } from "../../domain/entities/reserva.js";
import { ReservaService } from "../../domain/services/reserva-service.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";

export class ReservaServiceImpl implements ReservaService {
  validarCreacionReserva(
    habitacionId: string,
    clienteId: string,
    periodo: Periodo,
    numeroHuespedes: number
  ): Result<boolean, DomainError> {
    const errors: string[] = [];

    // Validar IDs
    if (!habitacionId || habitacionId.trim().length === 0) {
      errors.push('El ID de habitación es requerido');
    }

    if (!clienteId || clienteId.trim().length === 0) {
      errors.push('El ID de cliente es requerido');
    }

    // Validar período
    if (periodo.checkIn >= periodo.checkOut) {
      errors.push('La fecha de check-in debe ser anterior a la fecha de check-out');
    }

    const now = new Date();
    if (periodo.checkIn <= now) {
      errors.push('La fecha de check-in debe ser en el futuro');
    }

    // Validar número de huéspedes
    if (numeroHuespedes <= 0) {
      errors.push('El número de huéspedes debe ser mayor a 0');
    }

    if (numeroHuespedes > 10) {
      errors.push('El número de huéspedes no puede exceder 10');
    }

    if (errors.length > 0) {
      return Result.failure(new ValidationError(
        'Datos de reserva inválidos',
        { errors }
      ));
    }

    return Result.success(true);
  }

  validarConfirmacionReserva(reserva: Reserva): Result<boolean, DomainError> {
    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      return Result.failure(new InvalidReservationStateError(
        'Solo las reservas pendientes pueden confirmarse',
        { currentState: reserva.estado }
      ));
    }

    return Result.success(true);
  }

  validarCancelacionReserva(reserva: Reserva, motivo: string): Result<boolean, DomainError> {
    const errors: string[] = [];

    // Validar estado
    if (!this.puedeCancelarse(reserva)) {
      errors.push('Esta reserva no puede cancelarse en su estado actual');
    }

    // Validar motivo
    if (!motivo || motivo.trim().length === 0) {
      errors.push('El motivo de cancelación es requerido');
    }

    if (motivo && motivo.length > 200) {
      errors.push('El motivo de cancelación no puede exceder 200 caracteres');
    }

    if (errors.length > 0) {
      return Result.failure(new BusinessRuleError(
        'No se puede cancelar la reserva',
        { errors }
      ));
    }

    return Result.success(true);
  }

  validarCheckIn(reserva: Reserva): Result<boolean, DomainError> {
    if (reserva.estado !== EstadoReserva.CONFIRMADA) {
      return Result.failure(new InvalidReservationStateError(
        'Solo las reservas confirmadas pueden realizar check-in',
        { currentState: reserva.estado }
      ));
    }

    // Verificar que la fecha de check-in sea hoy o en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(reserva.periodo.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      return Result.failure(new BusinessRuleError(
        'No se puede hacer check-in antes de la fecha programada'
      ));
    }

    return Result.success(true);
  }

  validarCheckOut(reserva: Reserva): Result<boolean, DomainError> {
    if (reserva.estado !== EstadoReserva.CHECKIN) {
      return Result.failure(new InvalidReservationStateError(
        'Solo las reservas en check-in pueden realizar check-out',
        { currentState: reserva.estado }
      ));
    }

    return Result.success(true);
  }

  calcularPenalizacionCancelacion(reserva: Reserva): Result<Precio, DomainError> {
    if (reserva.estado !== EstadoReserva.CANCELADA) {
      return Result.success({ valor: 0, moneda: 'USD' });
    }

    // Calcular días antes del check-in
    const diasAntesCheckIn = Math.ceil(
      (reserva.periodo.checkIn.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    let porcentajePenalizacion = 0;

    if (diasAntesCheckIn >= 7) {
      porcentajePenalizacion = 0; // Sin penalización
    } else if (diasAntesCheckIn >= 3) {
      porcentajePenalizacion = 0.25; // 25% de penalización
    } else if (diasAntesCheckIn >= 1) {
      porcentajePenalizacion = 0.5; // 50% de penalización
    } else {
      porcentajePenalizacion = 1; // 100% de penalización
    }

    const penalizacion: Precio = {
      valor: reserva.precioTotal.valor * porcentajePenalizacion,
      moneda: reserva.precioTotal.moneda
    };

    return Result.success(penalizacion);
  }

  puedeModificarse(reserva: Reserva): Result<boolean, DomainError> {
    const puedeModificar = reserva.estado === EstadoReserva.PENDIENTE;
    return Result.success(puedeModificar);
  }

  crearReserva(
    id: string,
    habitacionId: string,
    clienteId: string,
    periodo: Periodo,
    precioTotal: Precio,
    numeroHuespedes: number,
    observaciones?: string
  ): Result<Reserva, DomainError> {
    // Validar datos de entrada
    const validacion = this.validarCreacionReserva(
      habitacionId,
      clienteId,
      periodo,
      numeroHuespedes
    );

    if (validacion.isFailure()) {
      return Result.failure(validacion.error);
    }

    // Crear la reserva
    const reserva: Reserva = {
      id,
      habitacionId,
      clienteId,
      periodo,
      estado: EstadoReserva.PENDIENTE,
      precioTotal,
      numeroHuespedes,
      observaciones,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    return Result.success(reserva);
  }

  confirmarReserva(reserva: Reserva): Result<Reserva, DomainError> {
    // Validar que se puede confirmar
    const validacion = this.validarConfirmacionReserva(reserva);
    if (validacion.isFailure()) {
      return Result.failure(validacion.error);
    }

    // Crear nueva instancia con estado confirmado
    const reservaConfirmada: Reserva = {
      ...reserva,
      estado: EstadoReserva.CONFIRMADA,
      fechaActualizacion: new Date()
    };

    return Result.success(reservaConfirmada);
  }

  cancelarReserva(reserva: Reserva, motivo: string): Result<Reserva, DomainError> {
    // Validar que se puede cancelar
    const validacion = this.validarCancelacionReserva(reserva, motivo);
    if (validacion.isFailure()) {
      return Result.failure(validacion.error);
    }

    // Crear nueva instancia con estado cancelado
    const reservaCancelada: Reserva = {
      ...reserva,
      estado: EstadoReserva.CANCELADA,
      motivoCancelacion: motivo,
      fechaActualizacion: new Date()
    };

    return Result.success(reservaCancelada);
  }

  realizarCheckIn(reserva: Reserva): Result<Reserva, DomainError> {
    // Validar que se puede hacer check-in
    const validacion = this.validarCheckIn(reserva);
    if (validacion.isFailure()) {
      return Result.failure(validacion.error);
    }

    // Crear nueva instancia con estado check-in
    const reservaCheckIn: Reserva = {
      ...reserva,
      estado: EstadoReserva.CHECKIN,
      fechaActualizacion: new Date()
    };

    return Result.success(reservaCheckIn);
  }

  realizarCheckOut(reserva: Reserva): Result<Reserva, DomainError> {
    // Validar que se puede hacer check-out
    const validacion = this.validarCheckOut(reserva);
    if (validacion.isFailure()) {
      return Result.failure(validacion.error);
    }

    // Crear nueva instancia con estado check-out
    const reservaCheckOut: Reserva = {
      ...reserva,
      estado: EstadoReserva.CHECKOUT,
      fechaActualizacion: new Date()
    };

    return Result.success(reservaCheckOut);
  }

  private puedeCancelarse(reserva: Reserva): boolean {
    return reserva.estado === EstadoReserva.PENDIENTE || 
           reserva.estado === EstadoReserva.CONFIRMADA;
  }
}
