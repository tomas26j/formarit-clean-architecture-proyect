import { Habitacion } from "../entities/room.js";
import { Periodo, PeriodoImpl } from "../utils/types/lapse.js";
import { TipoHabitacion } from "../utils/types/room-type.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";

// DTOs para el caso de uso
export interface ConsultarDisponibilidadCommand {
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  tipoHabitacion?: string;
  capacidadMinima?: number;
  precioMaximo?: number;
}

export interface HabitacionDisponibleResponse {
  id: string;
  numero: string;
  tipo: string;
  capacidad: number;
  precioBase: number;
  precioTotal: number;
  piso: number;
  vista: string;
  amenidades: string[];
}

export interface DisponibilidadResponse {
  habitaciones: HabitacionDisponibleResponse[];
  totalDisponibles: number;
  periodo: {
    checkIn: string;
    checkOut: string;
    duracionNoches: number;
  };
}

// Caso de Uso: Consultar Disponibilidad
export class ConsultarDisponibilidadUseCase {
  constructor(
    private repositorioHabitaciones: RepositorioHabitaciones,
    private servicioDisponibilidad: ServicioDisponibilidad
  ) {}

  async execute(command: ConsultarDisponibilidadCommand): Promise<DisponibilidadResponse> {
    // 1. Validar datos de entrada
    this.validarCommand(command);

    // 2. Crear el período
    const periodo = PeriodoImpl.crear(
      new Date(command.checkIn),
      new Date(command.checkOut)
    );

    // 3. Buscar habitaciones disponibles
    let habitacionesDisponibles: Habitacion[];

    if (command.tipoHabitacion) {
      // Buscar por tipo específico
      const tipo = this.obtenerTipoHabitacion(command.tipoHabitacion);
      habitacionesDisponibles = await this.servicioDisponibilidad.buscarHabitacionesDisponibles(periodo, tipo);
    } else {
      // Buscar todas las disponibles
      habitacionesDisponibles = await this.servicioDisponibilidad.buscarHabitacionesDisponibles(periodo);
    }

    // 4. Aplicar filtros adicionales
    habitacionesDisponibles = this.aplicarFiltros(habitacionesDisponibles, command, periodo);

    // 5. Mapear a respuesta
    const habitacionesResponse = habitacionesDisponibles.map(habitacion => 
      this.mapearHabitacionARespuesta(habitacion, periodo)
    );

    // 6. Retornar respuesta
    return {
      habitaciones: habitacionesResponse,
      totalDisponibles: habitacionesResponse.length,
      periodo: {
        checkIn: periodo.checkIn.toISOString(),
        checkOut: periodo.checkOut.toISOString(),
        duracionNoches: periodo.duracionEnNoches()
      }
    };
  }

  private validarCommand(command: ConsultarDisponibilidadCommand): void {
    if (!command.checkIn || !command.checkOut) {
      throw new Error('Las fechas de check-in y check-out son requeridas');
    }

    // Validar formato de fechas
    const checkInDate = new Date(command.checkIn);
    const checkOutDate = new Date(command.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('Las fechas deben tener un formato válido');
    }

    if (command.capacidadMinima && command.capacidadMinima <= 0) {
      throw new Error('La capacidad mínima debe ser mayor a 0');
    }

    if (command.precioMaximo && command.precioMaximo <= 0) {
      throw new Error('El precio máximo debe ser mayor a 0');
    }
  }

  private obtenerTipoHabitacion(tipoString: string): TipoHabitacion {
    // En una implementación real, esto vendría de un enum o constante
    const tiposValidos = ['individual', 'doble', 'suite'];
    
    if (!tiposValidos.includes(tipoString.toLowerCase())) {
      throw new Error(`Tipo de habitación no válido: ${tipoString}`);
    }

    // Por simplicidad, retornamos un tipo básico
    // En una implementación real, esto vendría del repositorio o factory
    return {
      valor: tipoString.toLowerCase(),
      capacidad: tipoString.toLowerCase() === 'individual' ? 1 : 
                 tipoString.toLowerCase() === 'doble' ? 2 : 4,
      precioBase: tipoString.toLowerCase() === 'individual' ? 100 : 
                  tipoString.toLowerCase() === 'doble' ? 150 : 300,
      amenidades: [],
      equals: () => false
    };
  }

  private aplicarFiltros(
    habitaciones: Habitacion[], 
    command: ConsultarDisponibilidadCommand,
    periodo: Periodo
  ): Habitacion[] {
    let habitacionesFiltradas = [...habitaciones];

    // Filtrar por capacidad mínima
    if (command.capacidadMinima) {
      habitacionesFiltradas = habitacionesFiltradas.filter(
        habitacion => habitacion.tipo.capacidad >= command.capacidadMinima!
      );
    }

    // Filtrar por precio máximo
    if (command.precioMaximo) {
      habitacionesFiltradas = habitacionesFiltradas.filter(habitacion => {
        const precioTotal = habitacion.calcularPrecioTotal(periodo.duracionEnNoches());
        return precioTotal.valor <= command.precioMaximo!;
      });
    }

    return habitacionesFiltradas;
  }

  private mapearHabitacionARespuesta(habitacion: Habitacion, periodo: Periodo): HabitacionDisponibleResponse {
    const precioTotal = habitacion.calcularPrecioTotal(periodo.duracionEnNoches());

    return {
      id: habitacion.id,
      numero: habitacion.numero,
      tipo: habitacion.tipo.valor,
      capacidad: habitacion.tipo.capacidad,
      precioBase: habitacion.precioBase.valor,
      precioTotal: precioTotal.valor,
      piso: habitacion.piso,
      vista: habitacion.vista,
      amenidades: habitacion.tipo.amenidades
    };
  }
}
