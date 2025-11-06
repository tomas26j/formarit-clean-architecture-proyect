/**
 * Servicio de dominio para Usuario
 * Define las operaciones de negocio relacionadas con usuarios
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { Usuario, RolUsuario } from "../entities/usuario.js";
export interface UsuarioService {
    /**
     * Valida si un usuario puede ser creado
     */
    validarCreacionUsuario(nombre: string, email: string, rol: RolUsuario): Result<boolean, DomainError>;
    /**
     * Valida si un usuario puede ser desactivado
     */
    validarDesactivacionUsuario(usuario: Usuario): Result<boolean, DomainError>;
    /**
     * Valida si un usuario puede ser activado
     */
    validarActivacionUsuario(usuario: Usuario): Result<boolean, DomainError>;
    /**
     * Valida si un usuario puede cambiar de rol
     */
    validarCambioRol(usuario: Usuario, nuevoRol: RolUsuario): Result<boolean, DomainError>;
    /**
     * Valida si un usuario puede acceder a un recurso
     */
    validarAccesoRecurso(usuario: Usuario, recurso: string): Result<boolean, DomainError>;
    /**
     * Valida si un usuario puede vincularse a un cliente
     */
    validarVinculacionCliente(usuario: Usuario, clienteId: string): Result<boolean, DomainError>;
    /**
     * Crea un nuevo usuario
     */
    crearUsuario(id: string, nombre: string, email: string, rol: RolUsuario, telefono?: string): Result<Usuario, DomainError>;
    /**
     * Desactiva un usuario
     */
    desactivarUsuario(usuario: Usuario): Result<Usuario, DomainError>;
    /**
     * Activa un usuario
     */
    activarUsuario(usuario: Usuario): Result<Usuario, DomainError>;
    /**
     * Cambia el rol de un usuario
     */
    cambiarRolUsuario(usuario: Usuario, nuevoRol: RolUsuario): Result<Usuario, DomainError>;
    /**
     * Actualiza el teléfono de un usuario
     */
    actualizarTelefonoUsuario(usuario: Usuario, telefono: string): Result<Usuario, DomainError>;
    /**
     * Vincula un usuario a un cliente
     */
    vincularClienteUsuario(usuario: Usuario, clienteId: string): Result<Usuario, DomainError>;
}
