/**
 * Implementación de RepositorioReservas usando Prisma
 */

import { RepositorioReservas } from "@hotel/domain/src/infrastructure/repositories/reserva-repository.js";
import { Reserva } from "@hotel/domain/src/domain/entities/reserva.js";
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, InfrastructureError, DatabaseError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { prisma } from "./prisma-client.js";
import { mapReservaToDomain, mapReservaToPrismaCreate } from "./prisma-mappers.js";
import { Prisma } from "@prisma/client";

/**
 * Crea una implementación de RepositorioReservas usando Prisma
 */
export const crearPrismaReservaRepository = (): RepositorioReservas => {
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
   * Guarda una reserva
   */
  const guardar = async (reserva: Reserva): Promise<Result<Reserva, DomainError>> => {
    try {
      const data = mapReservaToPrismaCreate(reserva);
      
      const prismaReserva = await prisma.reserva.upsert({
        where: { id: reserva.id },
        create: data,
        update: data,
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
      });

      const reservaDomain = mapReservaToDomain(prismaReserva);
      return Result.success(reservaDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca una reserva por ID
   */
  const buscarPorId = async (id: string): Promise<Result<Reserva | null, DomainError>> => {
    try {
      const prismaReserva = await prisma.reserva.findUnique({
        where: { id },
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
      });

      if (!prismaReserva) {
        return Result.success(null);
      }

      const reservaDomain = mapReservaToDomain(prismaReserva);
      return Result.success(reservaDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca reservas por cliente
   */
  const buscarPorCliente = async (clienteId: string): Promise<Result<Reserva[], DomainError>> => {
    try {
      const prismaReservas = await prisma.reserva.findMany({
        where: { clienteId },
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const reservasDomain = prismaReservas.map(mapReservaToDomain);
      return Result.success(reservasDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca reservas por habitación
   */
  const buscarPorHabitacion = async (habitacionId: string): Promise<Result<Reserva[], DomainError>> => {
    try {
      const prismaReservas = await prisma.reserva.findMany({
        where: { habitacionId },
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
        orderBy: { checkIn: 'asc' },
      });

      const reservasDomain = prismaReservas.map(mapReservaToDomain);
      return Result.success(reservasDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca reservas por estado
   */
  const buscarPorEstado = async (estado: string): Promise<Result<Reserva[], DomainError>> => {
    try {
      const prismaReservas = await prisma.reserva.findMany({
        where: { estado },
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const reservasDomain = prismaReservas.map(mapReservaToDomain);
      return Result.success(reservasDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Busca reservas en un rango de fechas
   * Busca reservas que se solapen con el rango dado
   */
  const buscarPorRangoFechas = async (
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<Result<Reserva[], DomainError>> => {
    try {
      // Buscar reservas que se solapen con el rango
      // Una reserva se solapa si:
      // - Su checkIn está dentro del rango, O
      // - Su checkOut está dentro del rango, O
      // - El rango está completamente contenido en la reserva
      const prismaReservas = await prisma.reserva.findMany({
        where: {
          OR: [
            // CheckIn dentro del rango
            {
              AND: [
                { checkIn: { gte: fechaInicio } },
                { checkIn: { lte: fechaFin } },
              ],
            },
            // CheckOut dentro del rango
            {
              AND: [
                { checkOut: { gte: fechaInicio } },
                { checkOut: { lte: fechaFin } },
              ],
            },
            // Rango completamente contenido
            {
              AND: [
                { checkIn: { lte: fechaInicio } },
                { checkOut: { gte: fechaFin } },
              ],
            },
          ],
        },
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
        orderBy: { checkIn: 'asc' },
      });

      const reservasDomain = prismaReservas.map(mapReservaToDomain);
      return Result.success(reservasDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Verifica si existe una reserva con el mismo ID
   */
  const existe = async (id: string): Promise<Result<boolean, DomainError>> => {
    try {
      const count = await prisma.reserva.count({
        where: { id },
      });
      return Result.success(count > 0);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  /**
   * Elimina una reserva
   */
  const eliminar = async (id: string): Promise<Result<void, DomainError>> => {
    try {
      await prisma.reserva.delete({
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
   * Lista todas las reservas con paginación
   */
  const listar = async (
    limit?: number,
    offset?: number
  ): Promise<Result<Reserva[], DomainError>> => {
    try {
      const prismaReservas = await prisma.reserva.findMany({
        include: {
          habitacion: {
            include: {
              tipo: true,
            },
          },
          cliente: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      const reservasDomain = prismaReservas.map(mapReservaToDomain);
      return Result.success(reservasDomain);
    } catch (error) {
      return Result.failure(manejarError(error));
    }
  };

  return {
    guardar,
    buscarPorId,
    buscarPorCliente,
    buscarPorHabitacion,
    buscarPorEstado,
    buscarPorRangoFechas,
    existe,
    eliminar,
    listar,
  };
};

