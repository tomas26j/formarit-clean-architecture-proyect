/**
 * Implementación funcional en memoria del RepositorioUsuarios
 * Esta implementación pertenece a la capa de infraestructura del backend
 */

import { RepositorioUsuarios } from "@hotel/domain/src/repositories/usuario-repository.js";
import { Usuario, RolUsuario, UsuarioImpl } from "@hotel/domain/src/entities/user.js";
import bcrypt from 'bcryptjs';

// Almacenamiento en memoria con contraseñas hasheadas
const usuarios: Map<string, Usuario> = new Map();
const contraseñas: Map<string, string> = new Map(); // email -> hash

/**
 * Datos iniciales de ejemplo (opcional)
 */
const inicializarDatosEjemplo = async (): Promise<void> => {
  if (usuarios.size === 0) {
    const fechaActual = new Date();

    // Crear usuario admin de ejemplo
    const admin = UsuarioImpl.crear(
      'user-admin-1',
      'Administrador',
      'admin@hotel.com',
      RolUsuario.ADMIN
    );
    
    const hashAdmin = await bcrypt.hash('admin123', 10);
    usuarios.set(admin.id, admin);
    contraseñas.set(admin.email, hashAdmin);

    // Crear usuario recepcionista de ejemplo
    const recepcionista = UsuarioImpl.crear(
      'user-recep-1',
      'Recepcionista',
      'recep@hotel.com',
      RolUsuario.RECEPCIONISTA
    );
    
    const hashRecep = await bcrypt.hash('recep123', 10);
    usuarios.set(recepcionista.id, recepcionista);
    contraseñas.set(recepcionista.email, hashRecep);

    // Crear usuario huésped de ejemplo
    const huesped = UsuarioImpl.crear(
      'user-huesped-1',
      'Juan Pérez',
      'juan@example.com',
      RolUsuario.HUESPED,
      '+1234567890'
    );
    
    const hashHuesped = await bcrypt.hash('password123', 10);
    usuarios.set(huesped.id, huesped);
    contraseñas.set(huesped.email, hashHuesped);
  }
};

/**
 * Crea una implementación funcional del RepositorioUsuarios
 */
export const crearRepositorioUsuarios = (inicializarDatos: boolean = true): RepositorioUsuarios => {
  if (inicializarDatos) {
    inicializarDatosEjemplo().catch(console.error);
  }

  /**
   * Guarda un usuario
   */
  const guardar = async (usuario: Usuario): Promise<void> => {
    usuarios.set(usuario.id, usuario);
  };

  /**
   * Busca un usuario por ID
   */
  const buscarPorId = async (id: string): Promise<Usuario | null> => {
    return usuarios.get(id) || null;
  };

  /**
   * Elimina un usuario
   */
  const eliminar = async (id: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      usuarios.delete(id);
      contraseñas.delete(usuario.email);
    }
  };

  /**
   * Busca un usuario por email
   */
  const buscarPorEmail = async (email: string): Promise<Usuario | null> => {
    return Array.from(usuarios.values()).find((u) => u.email === email) || null;
  };

  /**
   * Busca usuarios por rol
   */
  const buscarPorRol = async (rol: RolUsuario): Promise<Usuario[]> => {
    return Array.from(usuarios.values()).filter((u) => u.rol === rol);
  };

  /**
   * Busca usuarios activos
   */
  const buscarActivos = async (): Promise<Usuario[]> => {
    return Array.from(usuarios.values()).filter((u) => u.activo);
  };

  /**
   * Busca usuarios inactivos
   */
  const buscarInactivos = async (): Promise<Usuario[]> => {
    return Array.from(usuarios.values()).filter((u) => !u.activo);
  };

  /**
   * Busca un usuario por cliente
   */
  const buscarPorCliente = async (clienteId: string): Promise<Usuario | null> => {
    return Array.from(usuarios.values()).find((u) => u.clienteId === clienteId) || null;
  };

  /**
   * Verifica credenciales de un usuario
   */
  const verificarCredenciales = async (
    email: string,
    password: string
  ): Promise<Usuario | null> => {
    const hash = contraseñas.get(email);
    if (!hash) {
      return null;
    }

    const esValido = await bcrypt.compare(password, hash);
    if (!esValido) {
      return null;
    }

    return buscarPorEmail(email);
  };

  /**
   * Actualiza el último acceso de un usuario
   */
  const actualizarUltimoAcceso = async (id: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      // En una implementación real, esto actualizaría un campo de último acceso
      // Por ahora solo guardamos el usuario
      usuarios.set(id, usuario);
    }
  };

  /**
   * Cuenta el total de usuarios
   */
  const contarUsuarios = async (): Promise<number> => {
    return usuarios.size;
  };

  /**
   * Cuenta usuarios por rol
   */
  const contarUsuariosPorRol = async (rol: RolUsuario): Promise<number> => {
    return Array.from(usuarios.values()).filter((u) => u.rol === rol).length;
  };

  /**
   * Cuenta usuarios activos
   */
  const contarUsuariosActivos = async (): Promise<number> => {
    return Array.from(usuarios.values()).filter((u) => u.activo).length;
  };

  /**
   * Verifica si existe un usuario
   */
  const verificarExistencia = async (id: string): Promise<boolean> => {
    return usuarios.has(id);
  };

  /**
   * Verifica si un email está disponible
   */
  const verificarEmailDisponible = async (email: string, excluirId?: string): Promise<boolean> => {
    const usuarioExistente = await buscarPorEmail(email);
    if (!usuarioExistente) {
      return true;
    }
    if (excluirId && usuarioExistente.id === excluirId) {
      return true;
    }
    return false;
  };

  /**
   * Activa un usuario
   */
  const activarUsuario = async (id: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      const usuarioActivado = usuario.activar();
      usuarios.set(id, usuarioActivado);
    }
  };

  /**
   * Desactiva un usuario
   */
  const desactivarUsuario = async (id: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      const usuarioDesactivado = usuario.desactivar();
      usuarios.set(id, usuarioDesactivado);
    }
  };

  /**
   * Cambia el rol de un usuario
   */
  const cambiarRol = async (id: string, nuevoRol: RolUsuario): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      const usuarioActualizado = usuario.cambiarRol(nuevoRol);
      usuarios.set(id, usuarioActualizado);
    }
  };

  /**
   * Vincula un usuario a un cliente
   */
  const vincularCliente = async (id: string, clienteId: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario) {
      const usuarioActualizado = usuario.vincularCliente(clienteId);
      usuarios.set(id, usuarioActualizado);
    }
  };

  /**
   * Desvincula un usuario de un cliente
   */
  const desvincularCliente = async (id: string): Promise<void> => {
    const usuario = usuarios.get(id);
    if (usuario && usuario.clienteId) {
      // Crear una nueva instancia sin clienteId
      const usuarioActualizado = new UsuarioImpl(
        usuario.id,
        usuario.nombre,
        usuario.email,
        usuario.rol,
        usuario.activo,
        undefined, // Sin clienteId
        usuario.telefono,
        usuario.fechaRegistro
      );
      usuarios.set(id, usuarioActualizado);
    }
  };

  /**
   * Busca usuarios con permisos para un recurso
   */
  const buscarUsuariosConPermisos = async (recurso: string): Promise<Usuario[]> => {
    return Array.from(usuarios.values()).filter((u) => u.puedeAccederARecurso(recurso));
  };

  /**
   * Busca usuarios por fecha de registro
   */
  const buscarUsuariosPorFechaRegistro = async (
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<Usuario[]> => {
    return Array.from(usuarios.values()).filter((u) => {
      const fechaRegistro = u.fechaRegistro;
      return fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin;
    });
  };

  /**
   * Busca usuarios inactivos por tiempo
   */
  const buscarUsuariosInactivosPorTiempo = async (diasInactivos: number): Promise<Usuario[]> => {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasInactivos);

    // Nota: En una implementación real, esto compararía con último acceso
    // Por ahora retornamos usuarios inactivos
    return Array.from(usuarios.values()).filter((u) => !u.activo);
  };

  /**
   * Función helper para guardar contraseña hasheada
   * Útil para cuando se crea un nuevo usuario
   */
  const guardarContraseña = async (email: string, password: string): Promise<void> => {
    const hash = await bcrypt.hash(password, 10);
    contraseñas.set(email, hash);
  };

  // Retornar objeto que implementa la interfaz
  return {
    guardar,
    buscarPorId,
    eliminar,
    buscarPorEmail,
    buscarPorRol,
    buscarActivos,
    buscarInactivos,
    buscarPorCliente,
    verificarCredenciales,
    actualizarUltimoAcceso,
    contarUsuarios,
    contarUsuariosPorRol,
    contarUsuariosActivos,
    verificarExistencia,
    verificarEmailDisponible,
    activarUsuario,
    desactivarUsuario,
    cambiarRol,
    vincularCliente,
    desvincularCliente,
    buscarUsuariosConPermisos,
    buscarUsuariosPorFechaRegistro,
    buscarUsuariosInactivosPorTiempo,
  };

  // Nota: guardarContraseña no está en la interfaz, pero es útil para la implementación
  // Se puede usar externamente cuando se crea un usuario
};

// Exportar función helper
export const guardarContraseñaUsuario = async (
  repositorio: RepositorioUsuarios,
  usuario: Usuario,
  password: string
): Promise<void> => {
  // Esta función debería ser llamada después de guardar un usuario
  // Para guardar la contraseña hasheada
  // Por ahora, la lógica está en el repositorio interno
};

