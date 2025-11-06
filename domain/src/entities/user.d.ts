import type { Entity } from "../utils/types/entity";
export declare enum RolUsuario {
    HUESPED = "huesped",
    RECEPCIONISTA = "recepcionista",
    GERENTE = "gerente",
    ADMIN = "admin"
}
export interface Usuario extends Entity {
    readonly nombre: string;
    readonly email: string;
    readonly rol: RolUsuario;
    readonly activo: boolean;
    readonly clienteId?: string;
    readonly telefono?: string;
    readonly fechaRegistro: Date;
    desactivar(): Usuario;
    activar(): Usuario;
    cambiarRol(nuevoRol: RolUsuario): Usuario;
    actualizarTelefono(telefono: string): Usuario;
    vincularCliente(clienteId: string): Usuario;
    puedeAccederARecurso(recurso: string): boolean;
}
export declare class UsuarioImpl implements Usuario {
    readonly id: string;
    readonly nombre: string;
    readonly email: string;
    readonly rol: RolUsuario;
    readonly activo: boolean;
    readonly clienteId?: string | undefined;
    readonly telefono?: string | undefined;
    readonly fechaRegistro: Date;
    constructor(id: string, nombre: string, email: string, rol: RolUsuario, activo?: boolean, clienteId?: string | undefined, telefono?: string | undefined, fechaRegistro?: Date);
    private validarUsuario;
    private validarEmail;
    desactivar(): Usuario;
    activar(): Usuario;
    cambiarRol(nuevoRol: RolUsuario): Usuario;
    actualizarTelefono(telefono: string): Usuario;
    vincularCliente(clienteId: string): Usuario;
    puedeAccederARecurso(recurso: string): boolean;
    static crear(id: string, nombre: string, email: string, rol: RolUsuario, telefono?: string): Usuario;
}
export type User = Usuario;
export declare const UserImpl: typeof UsuarioImpl;
