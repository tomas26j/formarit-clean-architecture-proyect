/**
 * Implementación funcional en memoria del RepositorioHabitaciones
 * Esta implementación pertenece a la capa de infraestructura del backend
 */

import { RepositorioHabitaciones } from "@hotel/domain/src/infrastructure/repositories/habitacion-repository.js";
import { Habitacion } from "@hotel/domain/src/domain/entities/habitacion.js";
import { Result } from "@hotel/domain/src/shared/types/result.js";
import { DomainError, InfrastructureError } from "@hotel/domain/src/shared/types/domain-errors.js";
import { Precio } from "@hotel/domain/src/shared/types/precio.js";
import { TipoHabitacion } from "@hotel/domain/src/shared/types/room-type.js";

// Almacenamiento en memoria
const habitaciones: Map<string, Habitacion> = new Map();

/**
 * Datos iniciales de ejemplo (opcional, puede estar vacío)
 */
const inicializarDatosEjemplo = (): void => {
  if (habitaciones.size === 0) {
    // Tipos de habitación de ejemplo
    const tipoIndividual: TipoHabitacion = {
      id: 'tipo-individual',
      nombre: 'individual',
      descripcion: 'Habitación individual para una persona',
      capacidad: 1,
      amenidades: ['WiFi', 'TV']
    };

    const tipoDoble: TipoHabitacion = {
      id: 'tipo-doble',
      nombre: 'doble',
      descripcion: 'Habitación doble para dos personas',
      capacidad: 2,
      amenidades: ['WiFi', 'TV', 'Minibar']
    };

    const tipoSuite: TipoHabitacion = {
      id: 'tipo-suite',
      nombre: 'suite',
      descripcion: 'Suite de lujo para hasta 4 personas',
      capacidad: 4,
      amenidades: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Vista al mar']
    };

    // Precios base de ejemplo
    const precioIndividual: Precio = { valor: 100, moneda: 'USD' };
    const precioDoble: Precio = { valor: 150, moneda: 'USD' };
    const precioSuite: Precio = { valor: 300, moneda: 'USD' };

    // Crear algunas habitaciones de ejemplo
    const fechaActual = new Date();

    const habitacionesEjemplo: Habitacion[] = [
      {
        id: 'habitacion-101',
        numero: '101',
        tipo: tipoIndividual,
        precioBase: precioIndividual,
        activa: true,
        piso: 1,
        vista: 'vista al jardín',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual
      },
      {
        id: 'habitacion-102',
        numero: '102',
        tipo: tipoIndividual,
        precioBase: precioIndividual,
        activa: true,
        piso: 1,
        vista: 'vista al jardín',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual
      },
      {
        id: 'habitacion-201',
        numero: '201',
        tipo: tipoDoble,
        precioBase: precioDoble,
        activa: true,
        piso: 2,
        vista: 'vista al mar',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual
      },
      {
        id: 'habitacion-202',
        numero: '202',
        tipo: tipoDoble,
        precioBase: precioDoble,
        activa: true,
        piso: 2,
        vista: 'vista al mar',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual
      },
      {
        id: 'habitacion-301',
        numero: '301',
        tipo: tipoSuite,
        precioBase: precioSuite,
        activa: true,
        piso: 3,
        vista: 'vista panorámica',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual
      }
    ];

    habitacionesEjemplo.forEach((hab) => {
      habitaciones.set(hab.id, hab);
    });
  }
};

/**
 * Crea una implementación funcional del RepositorioHabitaciones
 */
export const crearRepositorioHabitaciones = (inicializarDatos: boolean = true): RepositorioHabitaciones => {
  if (inicializarDatos) {
    inicializarDatosEjemplo();
  }

  /**
   * Guarda una habitación
   */
  const guardar = async (habitacion: Habitacion): Promise<Result<Habitacion, DomainError>> => {
    try {
      habitaciones.set(habitacion.id, habitacion);
      return Result.success(habitacion);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al guardar habitación: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca una habitación por ID
   */
  const buscarPorId = async (id: string): Promise<Result<Habitacion | null, DomainError>> => {
    try {
      const habitacion = habitaciones.get(id) || null;
      return Result.success(habitacion);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitación por ID: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca una habitación por número
   */
  const buscarPorNumero = async (numero: string): Promise<Result<Habitacion | null, DomainError>> => {
    try {
      const habitacion = Array.from(habitaciones.values()).find(
        (hab) => hab.numero === numero
      ) || null;
      return Result.success(habitacion);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitación por número: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca habitaciones por tipo
   */
  const buscarPorTipo = async (tipoId: string): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const habitacionesTipo = Array.from(habitaciones.values()).filter(
        (hab) => hab.tipo.id === tipoId || hab.tipo.nombre === tipoId
      );
      return Result.success(habitacionesTipo);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitaciones por tipo: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca habitaciones activas
   */
  const buscarActivas = async (): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const habitacionesActivas = Array.from(habitaciones.values()).filter(
        (hab) => hab.activa
      );
      return Result.success(habitacionesActivas);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitaciones activas: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Busca habitaciones por piso
   */
  const buscarPorPiso = async (piso: number): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const habitacionesPiso = Array.from(habitaciones.values()).filter(
        (hab) => hab.piso === piso
      );
      return Result.success(habitacionesPiso);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al buscar habitaciones por piso: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Verifica si existe una habitación con el mismo ID
   */
  const existe = async (id: string): Promise<Result<boolean, DomainError>> => {
    try {
      return Result.success(habitaciones.has(id));
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar existencia de habitación: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Verifica si existe una habitación con el mismo número
   */
  const existePorNumero = async (numero: string): Promise<Result<boolean, DomainError>> => {
    try {
      const existe = Array.from(habitaciones.values()).some((hab) => hab.numero === numero);
      return Result.success(existe);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al verificar existencia de habitación por número: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Elimina una habitación
   */
  const eliminar = async (id: string): Promise<Result<void, DomainError>> => {
    try {
      habitaciones.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al eliminar habitación: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  /**
   * Lista todas las habitaciones con paginación
   */
  const listar = async (
    limit?: number,
    offset?: number
  ): Promise<Result<Habitacion[], DomainError>> => {
    try {
      const todasHabitaciones = Array.from(habitaciones.values());
      
      // Aplicar paginación si se especifica
      let resultado = todasHabitaciones;
      if (offset !== undefined) {
        resultado = resultado.slice(offset);
      }
      if (limit !== undefined) {
        resultado = resultado.slice(0, limit);
      }
      
      return Result.success(resultado);
    } catch (error) {
      return Result.failure(
        new InfrastructureError(
          `Error al listar habitaciones: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  };

  // Retornar objeto que implementa la interfaz
  return {
    guardar,
    buscarPorId,
    buscarPorNumero,
    buscarPorTipo,
    buscarActivas,
    buscarPorPiso,
    existe,
    existePorNumero,
    eliminar,
    listar,
  };
};

