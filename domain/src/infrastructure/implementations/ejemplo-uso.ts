/**
 * Ejemplo de implementación usando la nueva arquitectura Clean Architecture
 * Demuestra cómo usar los casos de uso, servicios y dependencias
 */

import { crearReserva } from '../../domain/use-cases/crear-reserva.js';
import { CrearReservaDTO } from '../../application/dtos/reserva-dto.js';
import { CrearReservaDependencies } from '../../domain/use-cases/crear-reserva.js';
import { configureContainer, container } from '../container/dependency-container.js';
import { Result } from '../../shared/types/result.js';
import { DomainError } from '../../shared/types/domain-errors.js';

/**
 * Ejemplo de uso del caso de uso Crear Reserva
 */
export class EjemploUsoReserva {
  private dependencies: CrearReservaDependencies;

  constructor() {
    // Configurar el contenedor de dependencias
    configureContainer();
    
    // Obtener las dependencias del contenedor
    this.dependencies = {
      reservaService: container.resolve('reservaService'),
      reservaValidator: container.resolve('reservaValidator'),
      reservaMapper: container.resolve('reservaMapper'),
      repositorioReservas: container.resolve('repositorioReservas'),
      repositorioHabitaciones: container.resolve('repositorioHabitaciones'),
      servicioDisponibilidad: container.resolve('servicioDisponibilidad'),
      servicioPrecios: container.resolve('servicioPrecios'),
      generarId: container.resolve('generarId')
    };
  }

  /**
   * Ejemplo de creación de reserva exitosa.
   */
  async crearReservaExitosa(): Promise<void> {
    const command: CrearReservaDTO = {
      habitacionId: 'habitacion_101',
      clienteId: 'cliente_123',
      checkIn: '2024-03-01T15:00:00Z',
      checkOut: '2024-03-03T11:00:00Z',
      numeroHuespedes: 2,
      observaciones: 'Habitación con vista al mar'
    };

    try {
      const result = await crearReserva(command, this.dependencies);
      
      if (result.isSuccess()) {
        console.log('Reserva creada exitosamente:', result.data);
      } else {
        console.error('Error al crear reserva:', result.error.message);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }

  /**
   * Ejemplo de manejo de errores de validación
   */
  async crearReservaConErrores(): Promise<void> {
    const commandInvalido: CrearReservaDTO = {
      habitacionId: '', // ID vacío - debería fallar
      clienteId: 'cliente_123',
      checkIn: '2024-03-01T15:00:00Z',
      checkOut: '2024-03-03T11:00:00Z',
      numeroHuespedes: 0, // Número inválido - debería fallar
      observaciones: 'Habitación con vista al mar'
    };

    const result = await crearReserva(commandInvalido, this.dependencies);
    
    if (result.isFailure()) {
      console.log('Error esperado capturado:', result.error.message);
      console.log('Detalles del error:', result.error.details);
    }
  }

  /**
   * Ejemplo de uso con diferentes escenarios
   */
  async ejecutarEjemplos(): Promise<void> {
    console.log('=== Ejemplos de uso de Clean Architecture ===\n');

    console.log('1. Creando reserva exitosa...');
    await this.crearReservaExitosa();

    console.log('\n2. Probando validaciones...');
    await this.crearReservaConErrores();

    console.log('\n=== Ejemplos completados ===');
  }
}

/**
 * Función helper para ejecutar los ejemplos
 */
export const ejecutarEjemplos = async (): Promise<void> => {
  const ejemplo = new EjemploUsoReserva();
  await ejemplo.ejecutarEjemplos();
};

// Ejemplo de uso directo (descomentar para ejecutar)
// ejecutarEjemplos().catch(console.error);