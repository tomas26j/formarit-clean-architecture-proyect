/**
 * Repositorio para la entidad Habitación
 * Define las operaciones de persistencia
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Habitacion } from "../../domain/entities/habitacion.js";
export interface RepositorioHabitaciones {
    /**
     * Guarda una habitación
     */
    guardar(habitacion: Habitacion): Promise<Result<Habitacion, DomainError>>;
    /**
     * Busca una habitación por ID
     */
    buscarPorId(id: string): Promise<Result<Habitacion | null, DomainError>>;
    /**
     * Busca una habitación por número
     */
    buscarPorNumero(numero: string): Promise<Result<Habitacion | null, DomainError>>;
    /**
     * Busca habitaciones por tipo
     */
    buscarPorTipo(tipoId: string): Promise<Result<Habitacion[], DomainError>>;
    /**
     * Busca habitaciones activas
     */
    buscarActivas(): Promise<Result<Habitacion[], DomainError>>;
    /**
     * Busca habitaciones por piso
     */
    buscarPorPiso(piso: number): Promise<Result<Habitacion[], DomainError>>;
    /**
     * Verifica si existe una habitación con el mismo ID
     */
    existe(id: string): Promise<Result<boolean, DomainError>>;
    /**
     * Verifica si existe una habitación con el mismo número
     */
    existePorNumero(numero: string): Promise<Result<boolean, DomainError>>;
    /**
     * Elimina una habitación
     */
    eliminar(id: string): Promise<Result<void, DomainError>>;
    /**
     * Lista todas las habitaciones con paginación
     */
    listar(limit?: number, offset?: number): Promise<Result<Habitacion[], DomainError>>;
}
