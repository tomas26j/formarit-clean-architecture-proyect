import { Usuario, RolUsuario } from "../entities/user.js";

// Repositorio: Gestión de Usuarios
export interface RepositorioUsuarios {
  // Operaciones básicas
  guardar(usuario: Usuario): Promise<void>;
  buscarPorId(id: string): Promise<Usuario | null>;
  eliminar(id: string): Promise<void>;
  
  // Búsquedas específicas del dominio
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorRol(rol: RolUsuario): Promise<Usuario[]>;
  buscarActivos(): Promise<Usuario[]>;
  buscarInactivos(): Promise<Usuario[]>;
  buscarPorCliente(clienteId: string): Promise<Usuario | null>;
  
  // Operaciones de autenticación
  verificarCredenciales(email: string, password: string): Promise<Usuario | null>;
  actualizarUltimoAcceso(id: string): Promise<void>;
  
  // Operaciones de consulta
  contarUsuarios(): Promise<number>;
  contarUsuariosPorRol(rol: RolUsuario): Promise<number>;
  contarUsuariosActivos(): Promise<number>;
  verificarExistencia(id: string): Promise<boolean>;
  verificarEmailDisponible(email: string, excluirId?: string): Promise<boolean>;
  
  // Operaciones de gestión
  activarUsuario(id: string): Promise<void>;
  desactivarUsuario(id: string): Promise<void>;
  cambiarRol(id: string, nuevoRol: RolUsuario): Promise<void>;
  vincularCliente(id: string, clienteId: string): Promise<void>;
  desvincularCliente(id: string): Promise<void>;
  
  // Búsquedas complejas
  buscarUsuariosConPermisos(recurso: string): Promise<Usuario[]>;
  buscarUsuariosPorFechaRegistro(fechaInicio: Date, fechaFin: Date): Promise<Usuario[]>;
  buscarUsuariosInactivosPorTiempo(diasInactivos: number): Promise<Usuario[]>;
}
