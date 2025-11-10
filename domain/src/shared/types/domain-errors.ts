/**
 * Tipos de error específicos del dominio
 * Centraliza todos los errores posibles en el sistema
 */

export abstract class DomainError extends Error {
  abstract get code(): string;
  abstract get statusCode(): number;

  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Errores de validación
export class ValidationError extends DomainError {
  get code(): string { return 'VALIDATION_ERROR'; }
  get statusCode(): number { return 400; }
}

export class BusinessRuleError extends DomainError {
  get code(): string { return 'BUSINESS_RULE_ERROR'; }
  get statusCode(): number { return 422; }
}

// Errores de entidades
export class EntityNotFoundError extends DomainError {
  get code(): string { return 'ENTITY_NOT_FOUND'; }
  get statusCode(): number { return 404; }
}

export class EntityAlreadyExistsError extends DomainError {
  get code(): string { return 'ENTITY_ALREADY_EXISTS'; }
  get statusCode(): number { return 409; }
}

// Errores de reservas
export class ReservationError extends DomainError {
  get code(): string { return 'RESERVATION_ERROR'; }
  get statusCode(): number { return 422; }
}

export class RoomNotAvailableError extends ReservationError {
  override get code(): string { return 'ROOM_NOT_AVAILABLE'; }
  override get statusCode(): number { return 409; }

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

export class InvalidReservationStateError extends ReservationError {
  override get code(): string { return 'INVALID_RESERVATION_STATE'; }
  override get statusCode(): number { return 422; }

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

// Errores de habitaciones
export class RoomError extends DomainError {
  get code(): string { return 'ROOM_ERROR'; }
  get statusCode(): number { return 422; }
}

export class RoomCapacityExceededError extends RoomError {
  override get code(): string { return 'ROOM_CAPACITY_EXCEEDED'; }
  override get statusCode(): number { return 422; }

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

// Errores de usuarios
export class UserError extends DomainError {
  get code(): string { return 'USER_ERROR'; }
  get statusCode(): number { return 422; }
}

export class UnauthorizedError extends DomainError {
  get code(): string { return 'UNAUTHORIZED'; }
  get statusCode(): number { return 401; }
}

export class ForbiddenError extends DomainError {
  get code(): string { return 'FORBIDDEN'; }
  get statusCode(): number { return 403; }
}

// Errores de infraestructura
export class InfrastructureError extends DomainError {
  get code(): string { return 'INFRASTRUCTURE_ERROR'; }
  get statusCode(): number { return 500; }
}

export class DatabaseError extends InfrastructureError {
  override get code(): string { return 'DATABASE_ERROR'; }
  override get statusCode(): number { return 500; }

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

export class ExternalServiceError extends InfrastructureError {
  override get code(): string { return 'EXTERNAL_SERVICE_ERROR'; }
  override get statusCode(): number { return 502; }

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}
