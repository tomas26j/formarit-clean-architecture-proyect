/**
 * Implementación de RepositorioUsuarios usando Prisma
 * Nota: Esta interfaz no usa Result pattern, usa Promise directo
 */

import { RepositorioUsuarios } from "@hotel/domain/src/repositories/usuario-repository.js";
import { Usuario, RolUsuario } from "@hotel/domain/src/domain/entities/usuario.js";
import { mapUsuarioToDomain, mapUsuarioToPrismaCreate } from "./prisma-mappers.js";
import { prisma } from "./prisma-client.js";
import { Prisma } from "@prisma/client";

/**
 * Crea una implementación de RepositorioUsuarios usando Prisma
 */
export const crearPrismaUsuarioRepository = (): RepositorioUsuarios => {
  /**
   * Maneja errores de Prisma y los convierte a excepciones
   */
  const manejarError = (error: unknown, operacion: string): never => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new Error(`Violación de restricción única en ${operacion}: ${error.message}`);
        case 'P2003':
          throw new Error(`Violación de restricción de clave foránea en ${operacion}: ${error.message}`);
        case 'P2025':
          throw new Error(`Registro no encontrado en ${operacion}: ${error.message}`);
        default:
          throw new Error(`Error de base de datos en ${operacion}: ${error.message}`);
      }
    }
    
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(`Error de validación de Prisma en ${operacion}: ${error.message}`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`Error desconocido en ${operacion}`);
  };

  /**
   * Guarda un usuario
   */
  const guardar = async (usuario: Usuario): Promise<void> => {
    try {
      const data = mapUsuarioToPrismaCreate(usuario);
      
      await prisma.usuario.upsert({
        where: { id: usuario.id },
        create: data,
        update: data,
      });
    } catch (error) {
      manejarError(error, 'guardar usuario');
    }
  };

  /**
   * Busca un usuario por ID
   */
  const buscarPorId = async (id: string): Promise<Usuario | null> => {
    try {
      const prismaUsuario = await prisma.usuario.findUnique({
        where: { id },
      });

      if (!prismaUsuario) {
        return null;
      }

      return mapUsuarioToDomain(prismaUsuario);
    } catch (error) {
      manejarError(error, 'buscar usuario por ID');
    }
  };

  /**
   * Elimina un usuario
   */
  const eliminar = async (id: string): Promise<void> => {
    try {
      await prisma.usuario.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Registro no encontrado, no es un error crítico
        return;
      }
      manejarError(error, 'eliminar usuario');
    }
  };

  /**
   * Busca un usuario por email
   */
  const buscarPorEmail = async (email: string): Promise<Usuario | null> => {
    try {
      const prismaUsuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!prismaUsuario) {
        return null;
      }

      return mapUsuarioToDomain(prismaUsuario);
    } catch (error) {
      manejarError(error, 'buscar usuario por email');
    }
  };

  /**
   * Busca usuarios por rol
   */
  const buscarPorRol = async (rol: RolUsuario): Promise<Usuario[]> => {
    try {
      const prismaUsuarios = await prisma.usuario.findMany({
        where: { rol },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios por rol');
    }
  };

  /**
   * Busca usuarios activos
   */
  const buscarActivos = async (): Promise<Usuario[]> => {
    try {
      const prismaUsuarios = await prisma.usuario.findMany({
        where: { activo: true },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios activos');
    }
  };

  /**
   * Busca usuarios inactivos
   */
  const buscarInactivos = async (): Promise<Usuario[]> => {
    try {
      const prismaUsuarios = await prisma.usuario.findMany({
        where: { activo: false },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios inactivos');
    }
  };

  /**
   * Busca un usuario por cliente
   */
  const buscarPorCliente = async (clienteId: string): Promise<Usuario | null> => {
    try {
      const prismaUsuario = await prisma.usuario.findFirst({
        where: { clienteId },
      });

      if (!prismaUsuario) {
        return null;
      }

      return mapUsuarioToDomain(prismaUsuario);
    } catch (error) {
      manejarError(error, 'buscar usuario por cliente');
    }
  };

  /**
   * Verifica credenciales (email y password)
   * Nota: Requiere passwordHash en el modelo Prisma
   */
  const verificarCredenciales = async (email: string, password: string): Promise<Usuario | null> => {
    try {
      const prismaUsuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!prismaUsuario || !prismaUsuario.passwordHash) {
        return null;
      }

      // Importar bcryptjs dinámicamente para verificar password
      const bcrypt = await import('bcryptjs');
      const passwordValido = await bcrypt.default.compare(password, prismaUsuario.passwordHash);

      if (!passwordValido) {
        return null;
      }

      return mapUsuarioToDomain(prismaUsuario);
    } catch (error) {
      manejarError(error, 'verificar credenciales');
    }
  };

  /**
   * Actualiza el último acceso de un usuario
   */
  const actualizarUltimoAcceso = async (id: string): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { ultimoAcceso: new Date() },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Usuario no encontrado, no es un error crítico
        return;
      }
      manejarError(error, 'actualizar último acceso');
    }
  };

  /**
   * Cuenta usuarios
   */
  const contarUsuarios = async (): Promise<number> => {
    try {
      return await prisma.usuario.count();
    } catch (error) {
      manejarError(error, 'contar usuarios');
    }
  };

  /**
   * Cuenta usuarios por rol
   */
  const contarUsuariosPorRol = async (rol: RolUsuario): Promise<number> => {
    try {
      return await prisma.usuario.count({
        where: { rol },
      });
    } catch (error) {
      manejarError(error, 'contar usuarios por rol');
    }
  };

  /**
   * Cuenta usuarios activos
   */
  const contarUsuariosActivos = async (): Promise<number> => {
    try {
      return await prisma.usuario.count({
        where: { activo: true },
      });
    } catch (error) {
      manejarError(error, 'contar usuarios activos');
    }
  };

  /**
   * Verifica si existe un usuario
   */
  const verificarExistencia = async (id: string): Promise<boolean> => {
    try {
      const count = await prisma.usuario.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      manejarError(error, 'verificar existencia de usuario');
    }
  };

  /**
   * Verifica si un email está disponible
   */
  const verificarEmailDisponible = async (email: string, excluirId?: string): Promise<boolean> => {
    try {
      const count = await prisma.usuario.count({
        where: {
          email,
          ...(excluirId && { id: { not: excluirId } }),
        },
      });
      return count === 0;
    } catch (error) {
      manejarError(error, 'verificar email disponible');
    }
  };

  /**
   * Activa un usuario
   */
  const activarUsuario = async (id: string): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { activo: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      manejarError(error, 'activar usuario');
    }
  };

  /**
   * Desactiva un usuario
   */
  const desactivarUsuario = async (id: string): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { activo: false },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      manejarError(error, 'desactivar usuario');
    }
  };

  /**
   * Cambia el rol de un usuario
   */
  const cambiarRol = async (id: string, nuevoRol: RolUsuario): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { rol: nuevoRol },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      manejarError(error, 'cambiar rol de usuario');
    }
  };

  /**
   * Vincula un usuario a un cliente
   */
  const vincularCliente = async (id: string, clienteId: string): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { clienteId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      manejarError(error, 'vincular cliente');
    }
  };

  /**
   * Desvincula un usuario de un cliente
   */
  const desvincularCliente = async (id: string): Promise<void> => {
    try {
      await prisma.usuario.update({
        where: { id },
        data: { clienteId: null },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      manejarError(error, 'desvincular cliente');
    }
  };

  /**
   * Busca usuarios con permisos (simplificado - busca por rol)
   */
  const buscarUsuariosConPermisos = async (recurso: string): Promise<Usuario[]> => {
    try {
      // Implementación simplificada: buscar por roles que tengan acceso
      // En una implementación real, esto requeriría una tabla de permisos
      const rolesConAcceso: RolUsuario[] = [];
      
      if (recurso.includes('reserva')) {
        rolesConAcceso.push(RolUsuario.ADMIN, RolUsuario.GERENTE, RolUsuario.RECEPCIONISTA);
      } else if (recurso.includes('habitacion')) {
        rolesConAcceso.push(RolUsuario.ADMIN, RolUsuario.GERENTE);
      } else {
        rolesConAcceso.push(RolUsuario.ADMIN);
      }

      const prismaUsuarios = await prisma.usuario.findMany({
        where: {
          rol: { in: rolesConAcceso },
          activo: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios con permisos');
    }
  };

  /**
   * Busca usuarios por fecha de registro
   */
  const buscarUsuariosPorFechaRegistro = async (fechaInicio: Date, fechaFin: Date): Promise<Usuario[]> => {
    try {
      const prismaUsuarios = await prisma.usuario.findMany({
        where: {
          createdAt: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios por fecha de registro');
    }
  };

  /**
   * Busca usuarios inactivos por tiempo
   */
  const buscarUsuariosInactivosPorTiempo = async (diasInactivos: number): Promise<Usuario[]> => {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasInactivos);

      const prismaUsuarios = await prisma.usuario.findMany({
        where: {
          activo: false,
          OR: [
            { ultimoAcceso: { lte: fechaLimite } },
            { ultimoAcceso: null },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      return prismaUsuarios.map(mapUsuarioToDomain);
    } catch (error) {
      manejarError(error, 'buscar usuarios inactivos por tiempo');
    }
  };

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
};

