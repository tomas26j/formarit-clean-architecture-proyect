/**
 * Entidad de dominio: Usuario
 * Interface pura sin lógica de negocio
 */
import { Entity } from "../../shared/types/entity.js";
export declare enum RolUsuario {
    HUESPED = "huesped",
    RECEPCIONISTA = "recepcionista",
    GERENTE = "gerente",
    ADMIN = "admin"
}
/**
 * Entidad de dominio Usuario
 * Representa un usuario del sistema
 */
export interface Usuario extends Entity {
    readonly nombre: string;
    readonly email: string;
    readonly rol: RolUsuario;
    readonly activo: boolean;
    readonly clienteId?: string;
    readonly telefono?: string;
}
/**
 * Value Object para identificar un usuario
 */
export interface UsuarioId {
    readonly value: string;
}
/**
 * Value Object para el rol de un usuario
 */
export interface RolUsuarioVO {
    value: RolUsuario;
    puedeAccederARecurso(recurso: string): boolean;
    tienePermiso(permiso: string): boolean;
    esAdmin(): boolean;
    esGerente(): boolean;
    esRecepcionista(): boolean;
    esHuesped(): boolean;
}
