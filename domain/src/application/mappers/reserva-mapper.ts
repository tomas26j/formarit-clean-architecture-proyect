/**
 * Mappers para convertir entre DTOs y entidades de dominio
 * Centraliza la lógica de conversión entre capas
 */

import { Result } from "../../shared/types/result.js";
import { ValidationError } from "../../shared/types/domain-errors.js";
import { Reserva, EstadoReserva } from "../../domain/entities/reserva.js";
import { Periodo } from "../../shared/types/lapse.js";
import { Precio } from "../../shared/types/precio.js";
import { ReservaSchema, ReservaCreateSchema } from "../../domain/schemas/reserva-schema.js";
import { 
  CrearReservaDTO, 
  ReservaDTO, 
  ActualizarReservaDTO 
} from "../dtos/reserva-dto";

export interface ReservaMapper {
  dtoToEntity(dto: CrearReservaDTO, id: string, precioTotal: Precio): Result<Reserva, ValidationError>;
  entityToDto(entity: Reserva): ReservaDTO;
  entityToSchema(entity: Reserva): ReservaSchema;
  schemaToEntity(schema: ReservaSchema): Result<Reserva, ValidationError>;
  updateDtoToPartialEntity(dto: ActualizarReservaDTO): Partial<Reserva>;
}

/**
 * Convierte un DTO a una entidad de dominio
 */
export const dtoToEntity = (
  dto: CrearReservaDTO, 
  id: string, 
  precioTotal: Precio
): Result<Reserva, ValidationError> => {
  try {
    const checkInDate = new Date(dto.checkIn);
    const checkOutDate = new Date(dto.checkOut);
    const now = new Date();

    // Crear el período
    const periodo: Periodo = {
      checkIn: checkInDate,
      checkOut: checkOutDate
    };

    // Crear la entidad
    const reserva: Reserva = {
      id,
      habitacionId: dto.habitacionId,
      clienteId: dto.clienteId,
      periodo,
      estado: EstadoReserva.PENDIENTE,
      precioTotal,
      numeroHuespedes: dto.numeroHuespedes,
      observaciones: dto.observaciones,
      fechaCreacion: now,
      fechaActualizacion: now
    };

    return Result.success(reserva);
  } catch (error) {
    return Result.failure(new ValidationError(
      'Error al convertir DTO a entidad',
      { originalError: error }
    ));
  }
};

/**
 * Convierte una entidad de dominio a un DTO
 */
export const entityToDto = (entity: Reserva): ReservaDTO => {
  return {
    id: entity.id,
    habitacionId: entity.habitacionId,
    clienteId: entity.clienteId,
    checkIn: entity.periodo.checkIn.toISOString(),
    checkOut: entity.periodo.checkOut.toISOString(),
    estado: entity.estado,
    precioTotal: entity.precioTotal.valor,
    numeroHuespedes: entity.numeroHuespedes,
    observaciones: entity.observaciones,
    motivoCancelacion: entity.motivoCancelacion,
    fechaCreacion: entity.fechaCreacion.toISOString(),
    fechaActualizacion: entity.fechaActualizacion.toISOString()
  };
};

/**
 * Convierte una entidad de dominio a un schema
 */
export const entityToSchema = (entity: Reserva): ReservaSchema => {
  return {
    id: entity.id,
    habitacion_id: entity.habitacionId,
    cliente_id: entity.clienteId,
    check_in: entity.periodo.checkIn.toISOString(),
    check_out: entity.periodo.checkOut.toISOString(),
    estado: entity.estado,
    precio_total: entity.precioTotal.valor,
    numero_huespedes: entity.numeroHuespedes,
    observaciones: entity.observaciones,
    motivo_cancelacion: entity.motivoCancelacion,
    fecha_creacion: entity.fechaCreacion.toISOString(),
    fecha_actualizacion: entity.fechaActualizacion.toISOString()
  };
};

/**
 * Convierte un schema a una entidad de dominio
 */
export const schemaToEntity = (schema: ReservaSchema): Result<Reserva, ValidationError> => {
  try {
    const checkInDate = new Date(schema.check_in);
    const checkOutDate = new Date(schema.check_out);
    const fechaCreacion = new Date(schema.fecha_creacion);
    const fechaActualizacion = new Date(schema.fecha_actualizacion);

    // Crear el período
    const periodo: Periodo = {
      checkIn: checkInDate,
      checkOut: checkOutDate
    };

    // Crear el precio
    const precioTotal: Precio = {
      valor: schema.precio_total,
      moneda: 'USD' // Asumimos USD por defecto
    };

    // Crear la entidad
    const reserva: Reserva = {
      id: schema.id,
      habitacionId: schema.habitacion_id,
      clienteId: schema.cliente_id,
      periodo,
      estado: schema.estado,
      precioTotal,
      numeroHuespedes: schema.numero_huespedes,
      observaciones: schema.observaciones,
      motivoCancelacion: schema.motivo_cancelacion,
      fechaCreacion,
      fechaActualizacion
    };

    return Result.success(reserva);
  } catch (error) {
    return Result.failure(new ValidationError(
      'Error al convertir schema a entidad',
      { originalError: error }
    ));
  }
};

/**
 * Convierte un DTO de actualización a un objeto parcial de entidad
 */
export const updateDtoToPartialEntity = (dto: ActualizarReservaDTO): Partial<Reserva> => {
  const partial: Partial<Reserva> = {
    fechaActualizacion: new Date()
  };

  if (dto.estado !== undefined) {
    partial.estado = dto.estado;
  }

  if (dto.observaciones !== undefined) {
    partial.observaciones = dto.observaciones;
  }

  if (dto.motivoCancelacion !== undefined) {
    partial.motivoCancelacion = dto.motivoCancelacion;
  }

  return partial;
};

/**
 * Crea una implementación funcional del ReservaMapper
 * Retorna un objeto que implementa la interfaz ReservaMapper usando funciones puras
 */
export const crearReservaMapper = (): ReservaMapper => {
  return {
    dtoToEntity,
    entityToDto,
    entityToSchema,
    schemaToEntity,
    updateDtoToPartialEntity,
  };
};

// Exportar la clase por compatibilidad (deprecated, se eliminará en el futuro)
/**
 * @deprecated Usar las funciones exportadas directamente o crearReservaMapper()
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export class ReservaMapperImpl implements ReservaMapper {
  dtoToEntity = dtoToEntity;
  entityToDto = entityToDto;
  entityToSchema = entityToSchema;
  schemaToEntity = schemaToEntity;
  updateDtoToPartialEntity = updateDtoToPartialEntity;
}
