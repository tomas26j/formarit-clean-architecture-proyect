/**
 * Patrón Result para manejo de errores funcional
 * Evita el uso de excepciones y proporciona un manejo explícito de errores
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;
export declare class Success<T> {
    readonly data: T;
    readonly success: true;
    readonly failure: false;
    constructor(data: T);
    map<U>(fn: (value: T) => U): Result<U, never>;
    flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E>;
    getOrElse<U>(defaultValue: U): T | U;
    isSuccess(): this is Success<T>;
    isFailure(): this is Failure<never>;
}
export declare class Failure<E> {
    readonly error: E;
    readonly success: false;
    readonly failure: true;
    constructor(error: E);
    map<U>(_fn: (value: never) => U): Result<U, E>;
    flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E>;
    getOrElse<U>(defaultValue: U): U;
    isSuccess(): this is Success<never>;
    isFailure(): this is Failure<E>;
}
export declare const success: <T>(data: T) => Success<T>;
export declare const failure: <E>(error: E) => Failure<E>;
export declare namespace Result {
    const success: <T>(data: T) => Success<T>;
    const failure: <E>(error: E) => Failure<E>;
}
export declare const tryCatch: <T>(fn: () => Promise<T>) => Promise<Result<T, Error>>;
export declare const tryCatchSync: <T>(fn: () => T) => Result<T, Error>;
