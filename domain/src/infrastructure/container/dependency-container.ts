/**
 * Contenedor de dependencias
 * Centraliza la configuración y creación de todas las dependencias del sistema
 */

import { ReservaService } from "../../domain/services/reserva-service";
import { ReservaValidator } from "../../application/validators/reserva-validator";
import { ReservaMapper } from "../../application/mappers/reserva-mapper";
import { RepositorioReservas } from "../repositories/reserva-repository";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository";
import { ServicioDisponibilidad } from "../../domain/services/disponibilidad-service";
import { ServicioCalculoPrecio } from "../../domain/services/precio-service";

// Interfaces para las dependencias
export interface Dependencies {
  // Servicios de dominio
  reservaService: ReservaService;
  
  // Validadores
  reservaValidator: ReservaValidator;
  
  // Mappers
  reservaMapper: ReservaMapper;
  
  // Repositorios
  repositorioReservas: RepositorioReservas;
  repositorioHabitaciones: RepositorioHabitaciones;
  
  // Servicios de aplicación
  servicioDisponibilidad: ServicioDisponibilidad;
  servicioPrecios: ServicioCalculoPrecio;
  
  // Utilidades
  generarId: () => string;
}

export class DependencyContainer {
  private dependencies: Partial<Dependencies> = {};

  // Registro de dependencias
  register<K extends keyof Dependencies>(key: K, instance: Dependencies[K]): void {
    this.dependencies[key] = instance;
  }

  // Resolución de dependencias
  resolve<K extends keyof Dependencies>(key: K): Dependencies[K] {
    const dependency = this.dependencies[key];
    if (!dependency) {
      throw new Error(`Dependency ${String(key)} not registered`);
    }
    return dependency;
  }

  // Verificar si una dependencia está registrada
  isRegistered<K extends keyof Dependencies>(key: K): boolean {
    return key in this.dependencies;
  }

  // Obtener todas las dependencias registradas
  getAllDependencies(): Dependencies {
    return this.dependencies as Dependencies;
  }

  // Limpiar todas las dependencias (útil para testing)
  clear(): void {
    this.dependencies = {};
  }
}

// Instancia global del contenedor
export const container = new DependencyContainer();

// Factory para crear dependencias
export class DependencyFactory {
  static createReservaService(): ReservaService {
    // Importar la implementación concreta
    const { ReservaServiceImpl } = require("../services/reserva-service-impl");
    return new ReservaServiceImpl();
  }

  static createReservaValidator(): ReservaValidator {
    const { ReservaValidatorImpl } = require("../../application/validators/reserva-validator");
    return new ReservaValidatorImpl();
  }

  static createReservaMapper(): ReservaMapper {
    const { ReservaMapperImpl } = require("../../application/mappers/reserva-mapper");
    return new ReservaMapperImpl();
  }

  static createGenerarId(): () => string {
    return () => `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Configuración por defecto del contenedor
export const configureContainer = (): void => {
  // Registrar servicios de dominio
  container.register('reservaService', DependencyFactory.createReservaService());
  
  // Registrar validadores
  container.register('reservaValidator', DependencyFactory.createReservaValidator());
  
  // Registrar mappers
  container.register('reservaMapper', DependencyFactory.createReservaMapper());
  
  // Registrar utilidades
  container.register('generarId', DependencyFactory.createGenerarId());
  
  // Nota: Los repositorios y servicios de aplicación deben ser registrados
  // por la capa de infraestructura específica (base de datos, APIs externas, etc.
};
