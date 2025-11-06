/**
 * Implementación de RepositorioHabitaciones usando Prisma
 */

import { RepositorioHabitaciones } from "@hotel/domain/src/infrastructure/repositories/habitacion-repository.js";
import { Habitacion } from "@hotel/domain/src/domain/entities/habitacion.js";
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, InfrastructureError, DatabaseError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { prisma } from "./prisma-client.js";
import { mapHabitacionToDomain, mapHabitacionToPrismaCreate } from "./prisma-mappers.js";
import { Prisma } from "@prisma/client";

/**
 * Crea una implementación de RepositorioHabitaciones usando Prisma
 */
export const crearPrismaHabitacionRepository = (): RepositorioHabitaciones => {
  /**
   * Maneja errores de Prisma y los convierte a DomainError
   */
  const manejarError = (error: unknown): DomainError => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new InfrastructureError('Violación de restricción única en la base de datos', { code: error.code });
        case 'P2003':
          return new InfrastructureError('Violación de restricción de clave foránea', { code: error.code });
        case 'P2025':
          return new InfrastructureError('Registro no encontrado', { code: error.code });
        default:
          return new DatabaseError(`Error de base de datos: ${error.message}`, { code: error.code });
      }
    }
    
    if (error instanceof Prisma.PrismaClientValidationError) {
      return new InfrastructureError(`Error de validación de Prisma: ${error.message}`);
    }

    if (error instanceof Error) {
      return new DatabaseError(`Error inesperado: ${error.message}`);
    }

    return new DatabaseError('Error desconocido en la base de datos');
  };

  /**
   * Guarda una habitación
   */
  const guardar = async (habitacion: Habitacion): Promise<Result<Habitacion, DomainError>> => {
    try {
      // Primero, asegurar que el tipo de habitación existe
      const tipoExistente = await prisma.tipoHabitacion.findUnique({
        where: { id: habitacion.tipo.id },
      });

      if (!tipoExistente) {
        // Crear el tipo de habitación si no existe
        await prisma.tipoHabitacion.create({
          data: {
            id: habitacion.tipo.id,
            nombre: habitacion.tipo.nombre,
            descripcion: habitacion.tipo.descripcion,
            capacidad: habitacion.tipo.capacidad,
            amenidades: habitacion.tipo.amenidades,
          },
        });
      }

      const data = mapHabitacionToPrismaCreate(habitacion);
      
      const prismaHabitacion = await prisma.habitacion.upsert({
        where: { id: habitacion.id },
        create: data,
        update: data,
        include: {
          tipo: true,
        },
      });

      const habitacionDomain = mapHabitacionToDomain(prismaHabitacion);
      return Result.success(habitacionDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca una habitación por ID
   */
  const buscarPorId = async (id: string): Promise<Result<Habitacion | null, DomainError>> => {
    try {
      const prismaHabitacion = await prisma.habitacion.findUnique({
        where: { id },
        include: {
          tipo: true,
        },
      });

      if (!prismaHabitacion) {
        return Result.success(null);
      }

      const habitacionDomain = mapHabitacionToDomain(prismaHabitacion);
      return Result.success(habitacionDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca una habitación por número
   */
  const buscarPorNumero = async (numero: string): Promise<Result<Habitacion | null, DomainError>> => {
    try {
      const prismaHabitacion = await prisma.habitacion.findUnique({
        where: { numero },
        include: {
          tipo: true,
        },
      });

      if (!prismaHabitacion) {
        return Result.success(null);
      }

      const habitacionDomain = mapHabitacionToDomain(prismaHabitacion);
      return Result.success(habitacionDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca habitaciones por tipo
   */
  const buscarPorTipo = async (tipoId: string): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const prismaHabitaciones = await prisma.habitacion.findMany({
        where: { tipoId },
        include: {
          tipo: true,
        },
        orderBy: { numero: 'asc' },
      });

      const habitacionesDomain = prismaHabitaciones.map(mapHabitacionToDomain);
      return Result.success(habitacionesDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca habitaciones activas
   */
  const buscarActivas = async (): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const prismaHabitaciones = await prisma.habitacion.findMany({
        where: { activa: true },
        include: {
          tipo: true,
        },
        orderBy: { numero: 'asc' },
      });

      const habitacionesDomain = prismaHabitaciones.map(mapHabitacionToDomain);
      return Result.success(habitacionesDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca habitaciones por piso
   */
  const buscarPorPiso = async (piso: number): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const prismaHabitaciones = await prisma.habitacion.findMany({
        where: { piso },
        include: {
          tipo: true,
        },
        orderBy: { numero: 'asc' },
      });

      const habitacionesDomain = prismaHabitaciones.map(mapHabitacionToDomain);
      return Result.success(habitacionesDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Verifica si existe una habitación con el mismo ID
   */
  const existe = async (id: string): Promise<Result<boolean, DomainError>> => {
    try {
      const count = await prisma.habitacion.count({
        where: { id },
      });
      return Result.success(count > 0);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Verifica si existe una habitación con el mismo número
   */
  const existePorNumero = async (numero: string): Promise<Result<boolean, DomainError>> => {
    try {
      const count = await prisma.habitacion.count({
        where: { numero },
      });
      return Result.success(count > 0);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Elimina una habitación
   */
  const eliminar = async (id: string): Promise<Result<void, DomainError>> => {
    try {
      await prisma.habitacion.delete({
        where: { id },
      });
      return Result.success(undefined);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Registro no encontrado, no es un error crítico
        return Result.success(undefined);
      }
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Lista todas las habitaciones con paginación
   */
  const listar = async (
    limit?: number,
    offset?: number
  ): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const prismaHabitaciones = await prisma.habitacion.findMany({
        include: {
          tipo: true,
        },
        orderBy: { numero: 'asc' },
        take: limit,
        skip: offset,
      });

      const habitacionesDomain = prismaHabitaciones.map(mapHabitacionToDomain);
      return Result.success(habitacionesDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  return {
    guardar,
    buscarPorId,
    buscarPorNumero,
    buscarPorTipo,
    buscarActivas,
    buscarPorPiso,
    existe,
    existePorNumero,
    eliminar,
    listar,
  };
};

