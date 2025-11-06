/**
 * Tipos de error específicos del dominio
 * Centraliza todos los errores posibles en el sistema
 */
export declare abstract class DomainError extends Error {
    readonly details?: Record<string, any> | undefined;
    abstract readonly code: string;
    abstract readonly statusCode: number;
    constructor(message: string, details?: Record<string, any> | undefined);
}
export declare class ValidationError extends DomainError {
    readonly code = "VALIDATION_ERROR";
    readonly statusCode = 400;
}
export declare class BusinessRuleError extends DomainError {
    readonly code = "BUSINESS_RULE_ERROR";
    readonly statusCode = 422;
}
export declare class EntityNotFoundError extends DomainError {
    readonly code = "ENTITY_NOT_FOUND";
    readonly statusCode = 404;
}
export declare class EntityAlreadyExistsError extends DomainError {
    readonly code = "ENTITY_ALREADY_EXISTS";
    readonly statusCode = 409;
}
export declare class ReservationError extends DomainError {
    readonly code = "RESERVATION_ERROR";
    readonly statusCode = 422;
}
export declare class RoomNotAvailableError extends ReservationError {
    readonly code = "ROOM_NOT_AVAILABLE";
    readonly statusCode = 409;
    constructor(message: string, details?: Record<string, any>);
}
export declare class InvalidReservationStateError extends ReservationError {
    readonly code = "INVALID_RESERVATION_STATE";
    readonly statusCode = 422;
    constructor(message: string, details?: Record<string, any>);
}
export declare class RoomError extends DomainError {
    readonly code = "ROOM_ERROR";
    readonly statusCode = 422;
}
export declare class RoomCapacityExceededError extends RoomError {
    readonly code = "ROOM_CAPACITY_EXCEEDED";
    readonly statusCode = 422;
    constructor(message: string, details?: Record<string, any>);
}
export declare class UserError extends DomainError {
    readonly code = "USER_ERROR";
    readonly statusCode = 422;
}
export declare class UnauthorizedError extends DomainError {
    readonly code = "UNAUTHORIZED";
    readonly statusCode = 401;
}
export declare class ForbiddenError extends DomainError {
    readonly code = "FORBIDDEN";
    readonly statusCode = 403;
}
export declare class InfrastructureError extends DomainError {
    readonly code = "INFRASTRUCTURE_ERROR";
    readonly statusCode = 500;
}
export declare class DatabaseError extends InfrastructureError {
    readonly code = "DATABASE_ERROR";
    readonly statusCode = 500;
    constructor(message: string, details?: Record<string, any>);
}
export declare class ExternalServiceError extends InfrastructureError {
    readonly code = "EXTERNAL_SERVICE_ERROR";
    readonly statusCode = 502;
    constructor(message: string, details?: Record<string, any>);
}
