/**
 * Caso de Uso: Consultar Disponibilidad
 * Implementado como función pura siguiendo Clean Architecture
 */

import { Result } from "../../shared/types/result.js";
import { DomainError, ValidationError } from "../../shared/types/domain-errors.js";
import { Habitacion } from "../entities/habitacion.js";
import { Periodo } from "../../shared/types/lapse.js";
import { RepositorioHabitaciones } from "../../infrastructure/repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";

// DTOs para el caso de uso
export interface ConsultarDisponibilidadDTO {
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  tipoHabitacion?: string;
  capacidadMinima?: number;
  precioMaximo?: number;
}

export interface HabitacionDisponibleDTO {
  id: string;
  numero: string;
  tipo: string;
  capacidad: number;
  precioBase: number;
  precioTotal: number;
  piso: number;
  vista: string;
  amenidades: string[];
  activa: boolean;
}

export interface DisponibilidadDTO {
  habitaciones: HabitacionDisponibleDTO[];
  totalDisponibles: number;
  periodo: {
    checkIn: string;
    checkOut: string;
    duracionNoches: number;
  };
}

// Dependencias del caso de uso
export interface ConsultarDisponibilidadDependencies {
  repositorioHabitaciones: RepositorioHabitaciones;
  servicioDisponibilidad: ServicioDisponibilidad;
  servicioPrecios: ServicioCalculoPrecio;
}

/**
 * Función pura para consultar disponibilidad
 */
export const consultarDisponibilidad = async (
  command: ConsultarDisponibilidadDTO,
  dependencies: ConsultarDisponibilidadDependencies
): Promise<Result<DisponibilidadDTO, DomainError>> => {
  // 1. Validar datos de entrada
  const validacion = validarCommand(command);
  if (validacion.isFailure()) {
    return Result.failure(validacion.error);
  }

  // 2. Crear el período
  const periodo: Periodo = {
    checkIn: new Date(command.checkIn),
    checkOut: new Date(command.checkOut),
  };

  // 3. Buscar habitaciones disponibles usando el servicio
  const habitacionesDisponiblesResult = await dependencies.servicioDisponibilidad.buscarHabitacionesDisponibles(
    periodo,
    command.tipoHabitacion
  );

  if (habitacionesDisponiblesResult.isFailure()) {
    return Result.failure(habitacionesDisponiblesResult.error);
  }

  const habitacionIdsDisponibles = habitacionesDisponiblesResult.data;

  // 4. Obtener las habitaciones completas
  const habitacionesDisponibles: Habitacion[] = [];
  for (const habitacionId of habitacionIdsDisponibles) {
    const habitacionResult = await dependencies.repositorioHabitaciones.buscarPorId(habitacionId);
    if (habitacionResult.isSuccess() && habitacionResult.data) {
      habitacionesDisponibles.push(habitacionResult.data);
    }
  }

  // 5. Aplicar filtros adicionales
  let habitacionesFiltradas = aplicarFiltros(
    habitacionesDisponibles,
    command,
    periodo,
    dependencies.servicioPrecios
  );

  // 6. Calcular duración en noches
  const duracionNoches = calcularNoches(periodo);

  // 7. Mapear a respuesta
  const habitacionesResponse: HabitacionDisponibleDTO[] = habitacionesFiltradas.map((habitacion) => {
    const precioTotalResult = dependencies.servicioPrecios.calcularPrecio(habitacion, periodo);
    const precioTotal = precioTotalResult.isSuccess() ? precioTotalResult.data.valor : habitacion.precioBase.valor * duracionNoches;

    return {
      id: habitacion.id,
      numero: habitacion.numero,
      tipo: habitacion.tipo.nombre,
      capacidad: habitacion.tipo.capacidad,
      precioBase: habitacion.precioBase.valor,
      precioTotal,
      piso: habitacion.piso,
      vista: habitacion.vista,
      amenidades: habitacion.tipo.amenidades,
      activa: habitacion.activa,
    };
  });

  // 8. Retornar respuesta
  return Result.success({
    habitaciones: habitacionesResponse,
    totalDisponibles: habitacionesResponse.length,
    periodo: {
      checkIn: periodo.checkIn.toISOString(),
      checkOut: periodo.checkOut.toISOString(),
      duracionNoches,
    },
  });
};

/**
 * Calcula el número de noches entre dos fechas
 */
const calcularNoches = (periodo: Periodo): number => {
  const diffTime = periodo.checkOut.getTime() - periodo.checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

/**
 * Aplica filtros adicionales a las habitaciones
 */
const aplicarFiltros = (
  habitaciones: Habitacion[],
  command: ConsultarDisponibilidadDTO,
  periodo: Periodo,
  servicioPrecios: ServicioCalculoPrecio
): Habitacion[] => {
  let habitacionesFiltradas = [...habitaciones];

  // Filtrar por capacidad mínima
  if (command.capacidadMinima) {
    habitacionesFiltradas = habitacionesFiltradas.filter(
      (habitacion) => habitacion.tipo.capacidad >= command.capacidadMinima!
    );
  }

  // Filtrar por precio máximo
  if (command.precioMaximo) {
    habitacionesFiltradas = habitacionesFiltradas.filter((habitacion) => {
      const precioResult = servicioPrecios.calcularPrecio(habitacion, periodo);
      if (precioResult.isFailure()) {
        return false;
      }
      return precioResult.data.valor <= command.precioMaximo!;
    });
  }

  return habitacionesFiltradas;
};

/**
 * Valida el comando de consulta de disponibilidad
 */
const validarCommand = (command: ConsultarDisponibilidadDTO): Result<boolean, ValidationError> => {
  if (!command.checkIn || !command.checkOut) {
    return Result.failure(new ValidationError('Las fechas de check-in y check-out son requeridas'));
  }

  // Validar formato de fechas
  const checkInDate = new Date(command.checkIn);
  const checkOutDate = new Date(command.checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return Result.failure(new ValidationError('Las fechas deben tener un formato válido'));
  }

  if (checkInDate >= checkOutDate) {
    return Result.failure(new ValidationError('La fecha de check-in debe ser anterior a la fecha de check-out'));
  }

  if (checkInDate < new Date()) {
    return Result.failure(new ValidationError('La fecha de check-in debe ser en el futuro'));
  }

  if (command.capacidadMinima !== undefined && command.capacidadMinima <= 0) {
    return Result.failure(new ValidationError('La capacidad mínima debe ser mayor a 0'));
  }

  if (command.precioMaximo !== undefined && command.precioMaximo <= 0) {
    return Result.failure(new ValidationError('El precio máximo debe ser mayor a 0'));
  }

  return Result.success(true);
};

/**
 * Factory para crear el caso de uso con sus dependencias
 */
export const consultarDisponibilidadUseCase = (dependencies: ConsultarDisponibilidadDependencies) => {
  return (command: ConsultarDisponibilidadDTO) => consultarDisponibilidad(command, dependencies);
};

