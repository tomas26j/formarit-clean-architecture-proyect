/**
 * Mappers para convertir entre modelos Prisma y entidades de dominio
 */

import { Prisma } from "@prisma/client";
import { Habitacion } from "@hotel/domain/src/domain/entities/habitacion.js";
import { Reserva, EstadoReserva } from "@hotel/domain/src/domain/entities/reserva.js";
import { Usuario, RolUsuario } from "@hotel/domain/src/domain/entities/usuario.js";
import { TipoHabitacion } from "@hotel/domain/src/shared/types/room-type.js";
import { Precio } from "@hotel/domain/src/shared/types/precio.js";
import { Periodo } from "@hotel/domain/src/shared/types/lapse.js";

// Tipo para Prisma Usuario con relaciones
type PrismaUsuario = Prisma.UsuarioGetPayload<{
  include: {
    reservas: true;
  };
}>;

// Tipo para Prisma Habitacion con relaciones
type PrismaHabitacion = Prisma.HabitacionGetPayload<{
  include: {
    tipo: true;
    reservas: true;
  };
}>;

// Tipo para Prisma Reserva con relaciones
type PrismaReserva = Prisma.ReservaGetPayload<{
  include: {
    habitacion: {
      include: {
        tipo: true;
      };
    };
    cliente: true;
  };
}>;

// Tipo para Prisma TipoHabitacion
type PrismaTipoHabitacion = Prisma.TipoHabitacionGetPayload<{}>;

/**
 * Convierte un modelo Prisma TipoHabitacion a TipoHabitacion del dominio
 */
export const mapTipoHabitacionToDomain = (prisma: PrismaTipoHabitacion): TipoHabitacion => {
  return {
    id: prisma.id,
    nombre: prisma.nombre,
    descripcion: prisma.descripcion,
    capacidad: prisma.capacidad,
    amenidades: Array.isArray(prisma.amenidades) ? prisma.amenidades as string[] : [],
  };
};

/**
 * Convierte un modelo Prisma Habitacion a Habitacion del dominio
 */
export const mapHabitacionToDomain = (prisma: PrismaHabitacion): Habitacion => {
  return {
    id: prisma.id,
    numero: prisma.numero,
    tipo: mapTipoHabitacionToDomain(prisma.tipo),
    precioBase: {
      valor: prisma.precioBase,
      moneda: prisma.moneda,
    },
    activa: prisma.activa,
    piso: prisma.piso,
    vista: prisma.vista,
    fechaCreacion: prisma.createdAt,
    fechaActualizacion: prisma.updatedAt,
  };
};

/**
 * Convierte un modelo Prisma Reserva a Reserva del dominio
 */
export const mapReservaToDomain = (prisma: PrismaReserva): Reserva => {
  // Mapear estado de string a enum
  const estado = prisma.estado as EstadoReserva;
  
  return {
    id: prisma.id,
    habitacionId: prisma.habitacionId,
    clienteId: prisma.clienteId,
    periodo: {
      checkIn: prisma.checkIn,
      checkOut: prisma.checkOut,
    },
    estado,
    precioTotal: {
      valor: prisma.precioTotal,
      moneda: prisma.moneda,
    },
    numeroHuespedes: prisma.numeroHuespedes,
    observaciones: prisma.observaciones || undefined,
    motivoCancelacion: prisma.motivoCancelacion || undefined,
    fechaCreacion: prisma.createdAt,
    fechaActualizacion: prisma.updatedAt,
  };
};

/**
 * Convierte un modelo Prisma Usuario a Usuario del dominio
 */
export const mapUsuarioToDomain = (prisma: PrismaUsuario): Usuario => {
  // Mapear rol de string a enum
  const rol = prisma.rol as RolUsuario;
  
  return {
    id: prisma.id,
    nombre: prisma.nombre,
    email: prisma.email,
    rol,
    activo: prisma.activo,
    clienteId: prisma.clienteId || undefined,
    telefono: prisma.telefono || undefined,
    fechaCreacion: prisma.createdAt,
    fechaActualizacion: prisma.updatedAt,
  };
};

/**
 * Convierte una Reserva del dominio a datos para crear en Prisma
 */
export const mapReservaToPrismaCreate = (reserva: Reserva) => {
  return {
    id: reserva.id,
    habitacionId: reserva.habitacionId,
    clienteId: reserva.clienteId,
    checkIn: reserva.periodo.checkIn,
    checkOut: reserva.periodo.checkOut,
    estado: reserva.estado,
    precioTotal: reserva.precioTotal.valor,
    moneda: reserva.precioTotal.moneda,
    numeroHuespedes: reserva.numeroHuespedes,
    observaciones: reserva.observaciones,
    motivoCancelacion: reserva.motivoCancelacion,
    createdAt: reserva.fechaCreacion,
    updatedAt: reserva.fechaActualizacion,
  };
};

/**
 * Convierte una Habitacion del dominio a datos para crear en Prisma
 */
export const mapHabitacionToPrismaCreate = (habitacion: Habitacion) => {
  return {
    id: habitacion.id,
    numero: habitacion.numero,
    tipoId: habitacion.tipo.id,
    precioBase: habitacion.precioBase.valor,
    moneda: habitacion.precioBase.moneda,
    activa: habitacion.activa,
    piso: habitacion.piso,
    vista: habitacion.vista,
    createdAt: habitacion.fechaCreacion,
    updatedAt: habitacion.fechaActualizacion,
  };
};

/**
 * Convierte un Usuario del dominio a datos para crear en Prisma
 */
export const mapUsuarioToPrismaCreate = (usuario: Usuario, passwordHash?: string) => {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    passwordHash: passwordHash || null,
    rol: usuario.rol,
    activo: usuario.activo,
    clienteId: usuario.clienteId || null,
    telefono: usuario.telefono || null,
    createdAt: usuario.fechaCreacion,
    updatedAt: usuario.fechaActualizacion,
  };
};

