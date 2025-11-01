/**
 * Patrón Result para manejo de errores funcional
 * Evita el uso de excepciones y proporciona un manejo explícito de errores
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly success = true as const;
  readonly failure = false as const;

  constructor(public readonly data: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.data));
  }

  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.data);
  }

  getOrElse<U>(defaultValue: U): T | U {
    return this.data;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<never> {
    return false;
  }
}

export class Failure<E> {
  readonly success = false as const;
  readonly failure = true as const;

  constructor(public readonly error: E) {}

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as any;
  }

  flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E> {
    return this as any;
  }

  getOrElse<U>(defaultValue: U): U {
    return defaultValue;
  }

  isSuccess(): this is Success<never> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}

// Funciones helper para crear Results
export const success = <T>(data: T): Success<T> => new Success(data);
export const failure = <E>(error: E): Failure<E> => new Failure(error);

// Namespace para métodos estáticos de Result
export namespace Result {
  export const success = <T>(data: T): Success<T> => new Success(data);
  export const failure = <E>(error: E): Failure<E> => new Failure(error);
}

// Función para convertir promesas que pueden fallar en Results
export const tryCatch = async <T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> => {
  try {
    const result = await fn();
    return success(result);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

// Función para convertir funciones síncronas que pueden fallar en Results
export const tryCatchSync = <T>(fn: () => T): Result<T, Error> => {
  try {
    const result = fn();
    return success(result);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};
