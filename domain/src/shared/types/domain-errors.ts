/**
 * Tipos de error específicos del dominio
 * Centraliza todos los errores posibles en el sistema
 */

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Errores de validación
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_ERROR';
  readonly statusCode = 422;
}

// Errores de entidades
export class EntityNotFoundError extends DomainError {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;
}

export class EntityAlreadyExistsError extends DomainError {
  readonly code = 'ENTITY_ALREADY_EXISTS';
  readonly statusCode = 409;
}

// Errores de reservas
export class ReservationError extends DomainError {
  readonly code = 'RESERVATION_ERROR';
  readonly statusCode = 422;
}

export class RoomNotAvailableError extends ReservationError {
  readonly code = 'ROOM_NOT_AVAILABLE';
  readonly statusCode = 409;

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

export class InvalidReservationStateError extends ReservationError {
  readonly code = 'INVALID_RESERVATION_STATE';
  readonly statusCode = 422;

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

// Errores de habitaciones
export class RoomError extends DomainError {
  readonly code = 'ROOM_ERROR';
  readonly statusCode = 422;
}

export class RoomCapacityExceededError extends RoomError {
  readonly code = 'ROOM_CAPACITY_EXCEEDED';
  readonly statusCode = 422;

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

// Errores de usuarios
export class UserError extends DomainError {
  readonly code = 'USER_ERROR';
  readonly statusCode = 422;
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
}

export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
}

// Errores de infraestructura
export class InfrastructureError extends DomainError {
  readonly code = 'INFRASTRUCTURE_ERROR';
  readonly statusCode = 500;
}

export class DatabaseError extends InfrastructureError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

export class ExternalServiceError extends InfrastructureError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 502;

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}
