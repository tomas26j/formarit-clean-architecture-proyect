/**
 * Contenedor de dependencias funcional
 * Centraliza la configuración y creación de todas las dependencias del sistema
 * 
 * @deprecated Este archivo se mantiene por compatibilidad. 
 * Se recomienda usar las funciones de creación directas en lugar del contenedor.
 * Para el backend, usar apps/backend/src/infrastructure/dependencies.ts
 */

import { ReservaService } from "../../domain/services/reserva-service.js";
import { ReservaValidator } from "../../application/validators/reserva-validator.js";
import { ReservaMapper } from "../../application/mappers/reserva-mapper.js";
import { RepositorioReservas } from "../repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../../domain/services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../../domain/services/precio-service.js";
import { crearReservaService } from "../services/reserva-service-impl.js";
import { crearReservaValidator } from "../../application/validators/reserva-validator.js";
import { crearReservaMapper } from "../../application/mappers/reserva-mapper.js";

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

/**
 * @deprecated Usar funciones de creación directas en lugar del contenedor
 * Esta clase se mantiene solo por compatibilidad temporal
 */
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

// Instancia global del contenedor (deprecated)
/**
 * @deprecated Usar funciones de creación directas
 */
export const container = new DependencyContainer();

/**
 * @deprecated Usar funciones de creación directas (crearReservaService, crearReservaValidator, etc.)
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export class DependencyFactory {
  static createReservaService(): ReservaService {
    return crearReservaService();
  }

  static createReservaValidator(): ReservaValidator {
    return crearReservaValidator();
  }

  static createReservaMapper(): ReservaMapper {
    return crearReservaMapper();
  }

  static createGenerarId(): () => string {
    return () => `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Configuración por defecto del contenedor (deprecated)
 * @deprecated Usar funciones de creación directas
 */
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

/**
 * Función funcional para crear dependencias básicas del dominio
 * Esta es la forma recomendada de crear dependencias
 */
export const crearDependenciasDominio = () => {
  return {
    reservaService: crearReservaService(),
    reservaValidator: crearReservaValidator(),
    reservaMapper: crearReservaMapper(),
    generarId: () => `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};
