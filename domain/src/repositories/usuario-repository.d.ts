import { Usuario, RolUsuario } from "../entities/user.js";
export interface RepositorioUsuarios {
    guardar(usuario: Usuario): Promise<void>;
    buscarPorId(id: string): Promise<Usuario | null>;
    eliminar(id: string): Promise<void>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    buscarPorRol(rol: RolUsuario): Promise<Usuario[]>;
    buscarActivos(): Promise<Usuario[]>;
    buscarInactivos(): Promise<Usuario[]>;
    buscarPorCliente(clienteId: string): Promise<Usuario | null>;
    verificarCredenciales(email: string, password: string): Promise<Usuario | null>;
    actualizarUltimoAcceso(id: string): Promise<void>;
    contarUsuarios(): Promise<number>;
    contarUsuariosPorRol(rol: RolUsuario): Promise<number>;
    contarUsuariosActivos(): Promise<number>;
    verificarExistencia(id: string): Promise<boolean>;
    verificarEmailDisponible(email: string, excluirId?: string): Promise<boolean>;
    activarUsuario(id: string): Promise<void>;
    desactivarUsuario(id: string): Promise<void>;
    cambiarRol(id: string, nuevoRol: RolUsuario): Promise<void>;
    vincularCliente(id: string, clienteId: string): Promise<void>;
    desvincularCliente(id: string): Promise<void>;
    buscarUsuariosConPermisos(recurso: string): Promise<Usuario[]>;
    buscarUsuariosPorFechaRegistro(fechaInicio: Date, fechaFin: Date): Promise<Usuario[]>;
    buscarUsuariosInactivosPorTiempo(diasInactivos: number): Promise<Usuario[]>;
}
