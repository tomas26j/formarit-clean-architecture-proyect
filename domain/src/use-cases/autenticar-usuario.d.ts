import { RepositorioUsuarios } from "../repositories/usuario-repository.js";
export interface AutenticarUsuarioCommand {
    email: string;
    password: string;
}
export interface UsuarioAutenticadoResponse {
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
export declare class AutenticarUsuarioUseCase {
    private repositorioUsuarios;
    constructor(repositorioUsuarios: RepositorioUsuarios);
    execute(command: AutenticarUsuarioCommand): Promise<UsuarioAutenticadoResponse>;
    private validarCommand;
    private verificarCredenciales;
    private generarToken;
    private calcularExpiracionToken;
    private obtenerPermisos;
}
