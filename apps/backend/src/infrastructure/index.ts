/**
 * Exportaciones centralizadas de la capa de infraestructura
 */
export { crearDependencias } from './dependencies.js';
export type { BackendDependencies } from './dependencies.js';
export { crearRepositorioReservas } from './repositories/reserva-repository-impl.js';
export { crearRepositorioHabitaciones } from './repositories/habitacion-repository-impl.js';
export { crearRepositorioUsuarios } from './repositories/usuario-repository-impl.js';
export { crearServicioDisponibilidad } from './disponibilidad-service-impl.js';

