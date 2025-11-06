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
export interface Dependencies {
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
 * @deprecated Usar funciones de creación directas en lugar del contenedor
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export declare class DependencyContainer {
    private dependencies;
    register<K extends keyof Dependencies>(key: K, instance: Dependencies[K]): void;
    resolve<K extends keyof Dependencies>(key: K): Dependencies[K];
    isRegistered<K extends keyof Dependencies>(key: K): boolean;
    getAllDependencies(): Dependencies;
    clear(): void;
}
/**
 * @deprecated Usar funciones de creación directas
 */
export declare const container: DependencyContainer;
/**
 * @deprecated Usar funciones de creación directas (crearReservaService, crearReservaValidator, etc.)
 * Esta clase se mantiene solo por compatibilidad temporal
 */
export declare class DependencyFactory {
    static createReservaService(): ReservaService;
    static createReservaValidator(): ReservaValidator;
    static createReservaMapper(): ReservaMapper;
    static createGenerarId(): () => string;
}
/**
 * Configuración por defecto del contenedor (deprecated)
 * @deprecated Usar funciones de creación directas
 */
export declare const configureContainer: () => void;
/**
 * Función funcional para crear dependencias básicas del dominio
 * Esta es la forma recomendada de crear dependencias
 */
export declare const crearDependenciasDominio: () => {
    reservaService: ReservaService;
    reservaValidator: ReservaValidator;
    reservaMapper: ReservaMapper;
    generarId: () => string;
};
