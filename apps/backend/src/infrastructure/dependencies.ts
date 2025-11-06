/**
 * Módulo de configuración de dependencias funcional
 * Centraliza la creación e inyección de todas las dependencias del sistema
 */

// Repositorios - Usando Prisma
import { crearPrismaReservaRepository } from "./repositories/prisma-reserva-repository.js";
import { crearPrismaHabitacionRepository } from "./repositories/prisma-habitacion-repository.js";
import { crearPrismaUsuarioRepository } from "./repositories/prisma-usuario-repository.js";
import { prisma } from "./repositories/prisma-client.js";
import bcrypt from 'bcryptjs';

// Servicios
import { crearServicioDisponibilidad } from "./disponibilidad-service-impl.js";

// Implementaciones funcionales del dominio
import { crearReservaService } from "@hotel/domain/src/infrastructure/services/reserva-service-impl.js";
import { crearReservaValidator } from "@hotel/domain/src/application/validators/reserva-validator.js";
import { crearReservaMapper } from "@hotel/domain/src/application/mappers/reserva-mapper.js";

// Interfaces y tipos
import { RepositorioReservas } from "@hotel/domain/src/infrastructure/repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "@hotel/domain/src/infrastructure/repositories/habitacion-repository.js";
import { RepositorioUsuarios } from "@hotel/domain/src/repositories/usuario-repository.js";
import { ServicioDisponibilidad } from "@hotel/domain/src/domain/services/disponibilidad-service.js";
import { ReservaService } from "@hotel/domain/src/domain/services/reserva-service.js";
import { ReservaValidator } from "@hotel/domain/src/application/validators/reserva-validator.js";
import { ReservaMapper } from "@hotel/domain/src/application/mappers/reserva-mapper.js";
import { ServicioCalculoPrecio } from "@hotel/domain/src/domain/services/precio-service.js";

// Casos de uso
import { 
  crearReserva, 
  CrearReservaDependencies
} from "@hotel/domain/src/domain/use-cases/crear-reserva.js";
import { CrearReservaDTO, ReservaDTO } from "@hotel/domain/src/application/dtos/reserva-dto.js";
import {
  confirmarReserva,
  ConfirmarReservaDependencies,
  ConfirmarReservaDTO,
  ReservaConfirmadaDTO
} from "@hotel/domain/src/domain/use-cases/confirmar-reserva.js";
import {
  cancelarReserva,
  CancelarReservaDependencies,
  CancelarReservaDTO,
  ReservaCanceladaDTO
} from "@hotel/domain/src/domain/use-cases/cancelar-reserva.js";
import {
  consultarDisponibilidad,
  ConsultarDisponibilidadDependencies,
  ConsultarDisponibilidadDTO,
  DisponibilidadDTO
} from "@hotel/domain/src/domain/use-cases/consultar-disponibilidad.js";
import {
  autenticarUsuario,
  AutenticarUsuarioDependencies,
  AutenticarUsuarioDTO,
  UsuarioAutenticadoDTO
} from "@hotel/domain/src/domain/use-cases/autenticar-usuario.js";

// Tipos y utilidades
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, EntityNotFoundError, InfrastructureError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { Periodo } from "@hotel/domain/src/shared/types/lapse.js";
import { Habitacion } from "@hotel/domain/src/domain/entities/habitacion.js";
import { Precio } from "@hotel/domain/src/shared/types/precio.js";
import { Usuario } from "@hotel/domain/src/domain/entities/usuario.js";
import jwt from 'jsonwebtoken';

/**
 * Implementación funcional del ServicioCalculoPrecio
 */
const crearServicioCalculoPrecio = (): ServicioCalculoPrecio => {
  /**
   * Calcula el número de noches entre dos fechas
   */
  const calcularNoches = (periodo: Periodo): number => {
    const diffTime = periodo.checkOut.getTime() - periodo.checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  /**
   * Calcula el precio total para una habitación en un período específico
   */
  const calcularPrecio = (
    habitacion: Habitacion,
    periodo: Periodo
  ): Result<Precio, DomainError> => {
    try {
      const noches = calcularNoches(periodo);
      const precioTotal = habitacion.precioBase.valor * noches;
      
      return Result.success({
        valor: precioTotal,
        moneda: habitacion.precioBase.moneda
      });
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al calcular precio: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Calcula el precio con descuentos aplicados
   */
  const calcularPrecioConDescuento = (
    habitacion: Habitacion,
    periodo: Periodo,
    descuento: number
  ): Result<Precio, DomainError> => {
    try {
      if (descuento < 0 || descuento > 100) {
        return Result.failure(
          new InfrastructureError('El porcentaje de descuento debe estar entre 0 y 100')
        );
      }

      const precioBaseResult = calcularPrecio(habitacion, periodo);
      if (precioBaseResult.isFailure()) {
        return Result.failure(precioBaseResult.error);
      }

      const precioBase = precioBaseResult.data;
      const descuentoMonto = precioBase.valor * (descuento / 100);
      const precioConDescuento = precioBase.valor - descuentoMonto;

      return Result.success({
        valor: precioConDescuento,
        moneda: precioBase.moneda
      });
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al calcular precio con descuento: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Calcula el precio con impuestos
   */
  const calcularPrecioConImpuestos = (
    precioBase: Precio,
    porcentajeImpuestos: number
  ): Result<Precio, DomainError> => {
    try {
      if (porcentajeImpuestos < 0) {
        return Result.failure(
          new InfrastructureError('El porcentaje de impuestos no puede ser negativo')
        );
      }

      const impuestos = precioBase.valor * (porcentajeImpuestos / 100);
      const precioConImpuestos = precioBase.valor + impuestos;

      return Result.success({
        valor: precioConImpuestos,
        moneda: precioBase.moneda
      });
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al calcular precio con impuestos: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Calcula el precio por noche
   */
  const calcularPrecioPorNoche = (
    habitacion: Habitacion,
    fecha: Date
  ): Result<Precio, DomainError> => {
    try {
      return Result.success({
        valor: habitacion.precioBase.valor,
        moneda: habitacion.precioBase.moneda
      });
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al calcular precio por noche: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Aplica descuentos estacionales
   */
  const aplicarDescuentoEstacional = (
    precio: Precio,
    fecha: Date
  ): Result<Precio, DomainError> => {
    try {
      // Por ahora retornamos el precio sin cambios
      // En una implementación real, aquí se calcularía el descuento según la temporada
      return Result.success(precio);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al aplicar descuento estacional: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Calcula penalizaciones por cancelación
   */
  const calcularPenalizacionCancelacion = (
    precio: Precio,
    diasAntesCheckIn: number
  ): Result<Precio, DomainError> => {
    try {
      let porcentajePenalizacion = 0;
      
      // Más días antes = menos penalización
      if (diasAntesCheckIn >= 30) {
        porcentajePenalizacion = 0; // Sin penalización
      } else if (diasAntesCheckIn >= 15) {
        porcentajePenalizacion = 10; // 10% de penalización
      } else if (diasAntesCheckIn >= 7) {
        porcentajePenalizacion = 25; // 25% de penalización
      } else if (diasAntesCheckIn >= 3) {
        porcentajePenalizacion = 50; // 50% de penalización
      } else {
        porcentajePenalizacion = 100; // 100% de penalización (sin reembolso)
      }

      const penalizacion = precio.valor * (porcentajePenalizacion / 100);

      return Result.success({
        valor: penalizacion,
        moneda: precio.moneda
      });
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al calcular penalización: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  return {
    calcularPrecio,
    calcularPrecioConDescuento,
    calcularPrecioConImpuestos,
    calcularPrecioPorNoche,
    aplicarDescuentoEstacional,
    calcularPenalizacionCancelacion,
  };
};

/**
 * Función para generar IDs únicos
 */
const generarId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `reserva_${timestamp}_${random}`;
};

/**
 * Interfaz con todas las dependencias configuradas del backend
 */
// Extensión del repositorio de usuarios para incluir guardar contraseña
// Esto es necesario porque la interfaz del dominio no incluye este método
export interface RepositorioUsuariosExtendido extends RepositorioUsuarios {
  guardarContraseña?(email: string, password: string): Promise<void>;
}

export interface BackendDependencies {
  // Repositorios
  repositorioReservas: RepositorioReservas;
  repositorioHabitaciones: RepositorioHabitaciones;
  repositorioUsuarios: RepositorioUsuarios;

  // Servicios
  servicioDisponibilidad: ServicioDisponibilidad;
  servicioPrecios: ServicioCalculoPrecio;

  // Casos de uso (funciones parcialmente aplicadas)
  crearReserva: (command: CrearReservaDTO) => Promise<Result<ReservaDTO, DomainError>>;
  confirmarReserva: (command: ConfirmarReservaDTO) => Promise<Result<ReservaConfirmadaDTO, DomainError>>;
  cancelarReserva: (command: CancelarReservaDTO) => Promise<Result<ReservaCanceladaDTO, DomainError>>;
  consultarDisponibilidad: (command: ConsultarDisponibilidadDTO) => Promise<Result<DisponibilidadDTO, DomainError>>;
  autenticarUsuario: (command: AutenticarUsuarioDTO) => Promise<Result<UsuarioAutenticadoDTO, DomainError>>;

  // Utilidades
  generarId: () => string;
  
  // Helper para guardar contraseña (función separada para no violar la interfaz del dominio)
  guardarContraseñaUsuario?: (email: string, password: string) => Promise<void>;
}

/**
 * Crea y configura todas las dependencias del sistema
 * Esta es la función principal que debe llamarse al inicializar la aplicación
 */
export const crearDependencias = (): BackendDependencies => {
  // 1. Crear repositorios usando Prisma
  const repositorioReservas = crearPrismaReservaRepository();
  const repositorioHabitaciones = crearPrismaHabitacionRepository();
  const repositorioUsuarios = crearPrismaUsuarioRepository();

  // 2. Crear servicios
  const servicioDisponibilidad = crearServicioDisponibilidad({
    repositorioReservas,
    repositorioHabitaciones,
  });
  
  const servicioPrecios = crearServicioCalculoPrecio();

  // 3. Crear servicios y utilidades del dominio usando funciones funcionales
  const reservaService = crearReservaService();
  const reservaValidator = crearReservaValidator();
  const reservaMapper = crearReservaMapper();
  const generarIdFn = generarId;

  // 4. Crear dependencias para el caso de uso crearReserva
  const crearReservaDependencies: CrearReservaDependencies = {
    reservaService,
    reservaValidator,
    reservaMapper,
    repositorioReservas,
    repositorioHabitaciones,
    servicioDisponibilidad,
    servicioPrecios,
    generarId: generarIdFn,
  };

  // 5. Crear funciones parcialmente aplicadas para todos los casos de uso
  const crearReservaFn = (command: CrearReservaDTO) => 
    crearReserva(command, crearReservaDependencies);

  const confirmarReservaDependencies: ConfirmarReservaDependencies = {
    repositorioReservas,
    repositorioHabitaciones,
    servicioDisponibilidad,
  };
  const confirmarReservaFn = (command: ConfirmarReservaDTO) =>
    confirmarReserva(command, confirmarReservaDependencies);

  const cancelarReservaDependencies: CancelarReservaDependencies = {
    repositorioReservas,
    servicioPrecios,
  };
  const cancelarReservaFn = (command: CancelarReservaDTO) =>
    cancelarReserva(command, cancelarReservaDependencies);

  const consultarDisponibilidadDependencies: ConsultarDisponibilidadDependencies = {
    repositorioHabitaciones,
    servicioDisponibilidad,
    servicioPrecios,
  };
  const consultarDisponibilidadFn = (command: ConsultarDisponibilidadDTO) =>
    consultarDisponibilidad(command, consultarDisponibilidadDependencies);

  // Función para generar tokens JWT
  const generarToken = (usuario: Usuario): string => {
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    );
  };

  const autenticarUsuarioDependencies: AutenticarUsuarioDependencies = {
    repositorioUsuarios,
    generarToken,
  };
  const autenticarUsuarioFn = (command: AutenticarUsuarioDTO) =>
    autenticarUsuario(command, autenticarUsuarioDependencies);

  // Helper para guardar contraseña (necesario para registro de usuarios)
  // Usando Prisma directamente para actualizar el passwordHash
  const guardarContraseñaFn = async (email: string, password: string): Promise<void> => {
    const hash = await bcrypt.hash(password, 10);
    await prisma.usuario.update({
      where: { email },
      data: { passwordHash: hash },
    });
  };

  // 6. Retornar todas las dependencias configuradas
  return {
    repositorioReservas,
    repositorioHabitaciones,
    repositorioUsuarios,
    servicioDisponibilidad,
    servicioPrecios,
    crearReserva: crearReservaFn,
    confirmarReserva: confirmarReservaFn,
    cancelarReserva: cancelarReservaFn,
    consultarDisponibilidad: consultarDisponibilidadFn,
    autenticarUsuario: autenticarUsuarioFn,
    generarId: generarIdFn,
    guardarContraseñaUsuario: guardarContraseñaFn,
  };
};

/**
 * Exportar función helper para inicializar dependencias de forma asíncrona si es necesario
 */
export const inicializarDependencias = async (): Promise<BackendDependencies> => {
  // Por ahora es síncrono, pero puede necesitar ser async si hay inicializaciones async
  return crearDependencias();
};

