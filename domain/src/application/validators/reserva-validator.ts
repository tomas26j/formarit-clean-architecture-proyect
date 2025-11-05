/**
 * Validadores para DTOs de Reserva
 * Centraliza todas las validaciones de entrada
 */

import { Result } from "../../shared/types/result.js";
import { ValidationError } from "../../shared/types/domain-errors.js";
import { CrearReservaDTO, ActualizarReservaDTO, CancelarReservaDTO } from "../dtos/reserva-dto";

export interface ReservaValidator {
  validarCrearReserva(dto: CrearReservaDTO): Result<boolean, ValidationError>;
  validarActualizarReserva(dto: ActualizarReservaDTO): Result<boolean, ValidationError>;
  validarCancelarReserva(dto: CancelarReservaDTO): Result<boolean, ValidationError>;
  validarIdReserva(id: string): Result<boolean, ValidationError>;
  validarFechas(checkIn: string, checkOut: string): Result<boolean, ValidationError>;
  validarNumeroHuespedes(numero: number): Result<boolean, ValidationError>;
}

/**
 * Valida los datos para crear una reserva
 */
export const validarCrearReserva = (dto: CrearReservaDTO): Result<boolean, ValidationError> => {
  const errors: string[] = [];

  // Validar habitacionId
  if (!dto.habitacionId || dto.habitacionId.trim().length === 0) {
    errors.push('El ID de habitación es requerido');
  }

  // Validar clienteId
  if (!dto.clienteId || dto.clienteId.trim().length === 0) {
    errors.push('El ID de cliente es requerido');
  }

  // Validar fechas
  const fechaValidation = validarFechas(dto.checkIn, dto.checkOut);
  if (fechaValidation.isFailure()) {
    errors.push(fechaValidation.error.message);
  }

  // Validar número de huéspedes
  const huespedesValidation = validarNumeroHuespedes(dto.numeroHuespedes);
  if (huespedesValidation.isFailure()) {
    errors.push(huespedesValidation.error.message);
  }

  // Validar observaciones (opcional)
  if (dto.observaciones && dto.observaciones.length > 500) {
    errors.push('Las observaciones no pueden exceder 500 caracteres');
  }

  if (errors.length > 0) {
    return Result.failure(new ValidationError(
      'Datos de reserva inválidos',
      { errors }
    ));
  }

  return Result.success(true);
};

/**
 * Valida los datos para actualizar una reserva
 */
export const validarActualizarReserva = (dto: ActualizarReservaDTO): Result<boolean, ValidationError> => {
  const errors: string[] = [];

  // Validar que al menos un campo sea proporcionado
  if (!dto.estado && !dto.observaciones && !dto.motivoCancelacion) {
    errors.push('Al menos un campo debe ser proporcionado para actualizar');
  }

  // Validar observaciones
  if (dto.observaciones && dto.observaciones.length > 500) {
    errors.push('Las observaciones no pueden exceder 500 caracteres');
  }

  // Validar motivo de cancelación
  if (dto.motivoCancelacion && dto.motivoCancelacion.length > 200) {
    errors.push('El motivo de cancelación no puede exceder 200 caracteres');
  }

  if (errors.length > 0) {
    return Result.failure(new ValidationError(
      'Datos de actualización inválidos',
      { errors }
    ));
  }

  return Result.success(true);
};

/**
 * Valida los datos para cancelar una reserva
 */
export const validarCancelarReserva = (dto: CancelarReservaDTO): Result<boolean, ValidationError> => {
  const errors: string[] = [];

  // Validar ID de reserva
  const idValidation = validarIdReserva(dto.reservaId);
  if (idValidation.isFailure()) {
    errors.push(idValidation.error.message);
  }

  // Validar motivo
  if (!dto.motivo || dto.motivo.trim().length === 0) {
    errors.push('El motivo de cancelación es requerido');
  } else if (dto.motivo.length > 200) {
    errors.push('El motivo de cancelación no puede exceder 200 caracteres');
  }

  if (errors.length > 0) {
    return Result.failure(new ValidationError(
      'Datos de cancelación inválidos',
      { errors }
    ));
  }

  return Result.success(true);
};

/**
 * Valida el ID de una reserva
 */
export const validarIdReserva = (id: string): Result<boolean, ValidationError> => {
  if (!id || id.trim().length === 0) {
    return Result.failure(new ValidationError('El ID de reserva es requerido'));
  }

  if (id.length < 3 || id.length > 100) {
    return Result.failure(new ValidationError(
      'El ID de reserva debe tener entre 3 y 100 caracteres'
    ));
  }

  return Result.success(true);
};

/**
 * Valida las fechas de check-in y check-out
 */
export const validarFechas = (checkIn: string, checkOut: string): Result<boolean, ValidationError> => {
  const errors: string[] = [];

  if (!checkIn || !checkOut) {
    errors.push('Las fechas de check-in y check-out son requeridas');
    return Result.failure(new ValidationError('Fechas inválidas', { errors }));
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const now = new Date();

  // Validar formato de fechas
  if (isNaN(checkInDate.getTime())) {
    errors.push('La fecha de check-in tiene un formato inválido');
  }

  if (isNaN(checkOutDate.getTime())) {
    errors.push('La fecha de check-out tiene un formato inválido');
  }

  if (errors.length > 0) {
    return Result.failure(new ValidationError('Fechas inválidas', { errors }));
  }

  // Validar que check-in sea en el futuro
  if (checkInDate <= now) {
    errors.push('La fecha de check-in debe ser en el futuro');
  }

  // Validar que check-out sea después de check-in
  if (checkOutDate <= checkInDate) {
    errors.push('La fecha de check-out debe ser posterior a la fecha de check-in');
  }

  // Validar que la estadía no exceda un año
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 365) {
    errors.push('La estadía no puede exceder 365 días');
  }

  if (errors.length > 0) {
    return Result.failure(new ValidationError('Fechas inválidas', { errors }));
  }

  return Result.success(true);
};

/**
 * Valida el número de huéspedes
 */
export const validarNumeroHuespedes = (numero: number): Result<boolean, ValidationError> => {
  if (!Number.isInteger(numero)) {
    return Result.failure(new ValidationError(
      'El número de huéspedes debe ser un número entero'
    ));
  }

  if (numero <= 0) {
    return Result.failure(new ValidationError(
      'El número de huéspedes debe ser mayor a 0'
    ));
  }

  if (numero > 10) {
    return Result.failure(new ValidationError(
      'El número de huéspedes no puede exceder 10'
    ));
  }

  return Result.success(true);
};

/**
 * Crea una implementación funcional del ReservaValidator
 * Retorna un objeto que implementa la interfaz ReservaValidator usando funciones puras
 */
export const crearReservaValidator = (): ReservaValidator => {
  return {
    validarCrearReserva,
    validarActualizarReserva,
    validarCancelarReserva,
    validarIdReserva,
    validarFechas,
    validarNumeroHuespedes,
  };
};

// Exportar la clase por compatibilidad (deprecated, se eliminará en el futuro)
/**
 * @deprecated Usar las funciones exportadas directamente o crearReservaValidator()
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export class ReservaValidatorImpl implements ReservaValidator {
  validarCrearReserva = validarCrearReserva;
  validarActualizarReserva = validarActualizarReserva;
  validarCancelarReserva = validarCancelarReserva;
  validarIdReserva = validarIdReserva;
  validarFechas = validarFechas;
  validarNumeroHuespedes = validarNumeroHuespedes;
}
