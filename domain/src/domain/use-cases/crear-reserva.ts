/**
 * Caso de Uso: Crear Reserva
 * Implementado como función pura siguiendo Clean Architecture
 */

import { Result } from "../../shared/types/result.js";
import { DomainError, EntityNotFoundError, BusinessRuleError } from "../../shared/types/domain-errors.js";
import { Reserva } from "../entities/reserva.js";
import { CrearReservaDTO, ReservaDTO } from "../../application/dtos/reserva-dto.js";
import { ReservaService } from "../services/reserva-service.js";
import { ReservaValidator } from "../../application/validators/reserva-validator.js";
import { ReservaMapper } from "../../application/mappers/reserva-mapper.js";
import { RepositorioReservas } from "../../infrastructure/repositories/reserva-repository";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service";

// Dependencias del caso de uso
export interface CrearReservaDependencies {
  reservaService: ReservaService;
  reservaValidator: ReservaValidator;
  reservaMapper: ReservaMapper;
  repositorioReservas: RepositorioReservas;
  repositorioHabitaciones: RepositorioHabitaciones;
  servicioDisponibilidad: ServicioDisponibilidad;
  servicioPrecios: ServicioCalculoPrecio;
  generarId: () => string;
}

/**
 * Función pura para crear una reserva
 * No tiene efectos secundarios y es completamente testeable
 */
export const crearReserva = async (
  command: CrearReservaDTO,
  dependencies: CrearReservaDependencies
): Promise<Result<ReservaDTO, DomainError>> => {
  // 1. Validar datos de entrada
  const validacion = dependencies.reservaValidator.validarCrearReserva(command);
  if (validacion.isFailure()) {
    return Result.failure(validacion.error);
  }

  // 2. Verificar que la habitación existe
  const habitacionResult = await dependencies.repositorioHabitaciones.buscarPorId(command.habitacionId);
  if (habitacionResult.isFailure()) {
    return Result.failure(habitacionResult.error);
  }

  const habitacion = habitacionResult.data;
  if (!habitacion) {
    return Result.failure(new EntityNotFoundError('Habitación no encontrada'));
  }

  // 3. Verificar que la habitación está activa
  if (!habitacion.activa) {
    return Result.failure(new BusinessRuleError('La habitación no está disponible para reservas'));
  }

  // 4. Verificar disponibilidad
  const disponibilidadResult = await dependencies.servicioDisponibilidad.verificarDisponibilidad(
    command.habitacionId,
    { checkIn: new Date(command.checkIn), checkOut: new Date(command.checkOut) }
  );

  if (disponibilidadResult.isFailure()) {
    return Result.failure(disponibilidadResult.error);
  }

  if (!disponibilidadResult.data) {
    return Result.failure(new BusinessRuleError('Habitación no disponible para las fechas solicitadas'));
  }

  // 5. Verificar capacidad de la habitación
  if (command.numeroHuespedes > habitacion.tipo.capacidad) {
    return Result.failure(new BusinessRuleError(
      `La habitación solo puede alojar ${habitacion.tipo.capacidad} huéspedes`
    ));
  }

  // 6. Calcular precio total
  const precioResult = dependencies.servicioPrecios.calcularPrecio(
    habitacion,
    { checkIn: new Date(command.checkIn), checkOut: new Date(command.checkOut) }
  );

  if (precioResult.isFailure()) {
    return Result.failure(precioResult.error);
  }

  // 7. Generar ID único para la reserva
  const reservaId = dependencies.generarId();

  // 8. Crear la reserva usando el servicio de dominio
  const reservaResult = dependencies.reservaMapper.dtoToEntity(
    command,
    reservaId,
    precioResult.data
  );

  if (reservaResult.isFailure()) {
    return Result.failure(reservaResult.error);
  }

  // 9. Validar la reserva creada
  const validacionReserva = dependencies.reservaService.validarCreacionReserva(
    reservaResult.data.habitacionId,
    reservaResult.data.clienteId,
    reservaResult.data.periodo,
    reservaResult.data.numeroHuespedes
  );

  if (validacionReserva.isFailure()) {
    return Result.failure(validacionReserva.error);
  }

  // 10. Guardar la reserva
  const guardarResult = await dependencies.repositorioReservas.guardar(reservaResult.data);
  if (guardarResult.isFailure()) {
    return Result.failure(guardarResult.error);
  }

  // 11. Convertir a DTO y retornar
  const reservaDTO = dependencies.reservaMapper.entityToDto(reservaResult.data);
  return Result.success(reservaDTO);
};

/**
 * Factory para crear el caso de uso con sus dependencias
 */
export const crearReservaUseCase = (dependencies: CrearReservaDependencies) => {
  return (command: CrearReservaDTO) => crearReserva(command, dependencies);
};
