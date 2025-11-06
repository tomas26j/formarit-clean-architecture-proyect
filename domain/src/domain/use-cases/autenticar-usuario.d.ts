/**
 * Caso de Uso: Autenticar Usuario
 * Implementado como función pura siguiendo Clean Architecture
 */
import { Result } from "../../shared/types/result.js";
import { DomainError } from "../../shared/types/domain-errors.js";
import { RepositorioUsuarios } from "../../../repositories/usuario-repository.js";
import { Usuario } from "../entities/usuario.js";
export interface AutenticarUsuarioDTO {
    email: string;
    password: string;
}
export interface UsuarioAutenticadoDTO {
    usuario: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
        activo: boolean;
    };
    token: string;
    expiraEn: string;
    permisos: string[];
}
export interface AutenticarUsuarioDependencies {
    repositorioUsuarios: RepositorioUsuarios;
    generarToken: (usuario: Usuario) => string;
}
/**
 * Función pura para autenticar un usuario
 */
export declare const autenticarUsuario: (command: AutenticarUsuarioDTO, dependencies: AutenticarUsuarioDependencies) => Promise<Result<UsuarioAutenticadoDTO, DomainError>>;
/**
 * Factory para crear el caso de uso con sus dependencias
 */
export declare const autenticarUsuarioUseCase: (dependencies: AutenticarUsuarioDependencies) => (command: AutenticarUsuarioDTO) => Promise<Result<UsuarioAutenticadoDTO, DomainError>>;
