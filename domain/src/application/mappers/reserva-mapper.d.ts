/**
 * Mappers para convertir entre DTOs y entidades de dominio
 * Centraliza la lógica de conversión entre capas
 */
import { Result } from "../../shared/types/result.js";
import { ValidationError } from "../../shared/types/domain-errors.js";
import { Reserva } from "../../domain/entities/reserva.js";
import { Precio } from "../../shared/types/precio.js";
import { ReservaSchema } from "../../domain/schemas/reserva-schema.js";
import { CrearReservaDTO, ReservaDTO, ActualizarReservaDTO } from "../dtos/reserva-dto";
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
export declare const dtoToEntity: (dto: CrearReservaDTO, id: string, precioTotal: Precio) => Result<Reserva, ValidationError>;
/**
 * Convierte una entidad de dominio a un DTO
 */
export declare const entityToDto: (entity: Reserva) => ReservaDTO;
/**
 * Convierte una entidad de dominio a un schema
 */
export declare const entityToSchema: (entity: Reserva) => ReservaSchema;
/**
 * Convierte un schema a una entidad de dominio
 */
export declare const schemaToEntity: (schema: ReservaSchema) => Result<Reserva, ValidationError>;
/**
 * Convierte un DTO de actualización a un objeto parcial de entidad
 */
export declare const updateDtoToPartialEntity: (dto: ActualizarReservaDTO) => Partial<Reserva>;
/**
 * Crea una implementación funcional del ReservaMapper
 * Retorna un objeto que implementa la interfaz ReservaMapper usando funciones puras
 */
export declare const crearReservaMapper: () => ReservaMapper;
/**
 * @deprecated Usar las funciones exportadas directamente o crearReservaMapper()
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export declare class ReservaMapperImpl implements ReservaMapper {
    dtoToEntity: (dto: CrearReservaDTO, id: string, precioTotal: Precio) => Result<Reserva, ValidationError>;
    entityToDto: (entity: Reserva) => ReservaDTO;
    entityToSchema: (entity: Reserva) => ReservaSchema;
    schemaToEntity: (schema: ReservaSchema) => Result<Reserva, ValidationError>;
    updateDtoToPartialEntity: (dto: ActualizarReservaDTO) => Partial<Reserva>;
}
