import { Habitacion } from "../entities/room.js";
import { Periodo } from "../utils/types/lapse.js";
import { TipoHabitacion } from "../utils/types/room-type.js";

// Repositorio: Gestión de Habitaciones
export interface RepositorioHabitaciones {
  // Operaciones básicas
  guardar(habitacion: Habitacion): Promise<void>;
  buscarPorId(id: string): Promise<Habitacion | null>;
  eliminar(id: string): Promise<void>;
  
  // Búsquedas específicas del dominio
  buscarPorNumero(numero: string): Promise<Habitacion | null>;
  buscarPorTipo(tipo: TipoHabitacion): Promise<Habitacion[]>;
  buscarPorPiso(piso: number): Promise<Habitacion[]>;
  buscarActivas(): Promise<Habitacion[]>;
  buscarInactivas(): Promise<Habitacion[]>;
  
  // Búsquedas de disponibilidad
  buscarDisponibles(periodo: Periodo): Promise<Habitacion[]>;
  buscarDisponiblesPorTipo(periodo: Periodo, tipo: TipoHabitacion): Promise<Habitacion[]>;
  buscarDisponiblesPorCapacidad(periodo: Periodo, capacidadMinima: number): Promise<Habitacion[]>;
  
  // Operaciones de consulta
  contarHabitaciones(): Promise<number>;
  contarHabitacionesPorTipo(tipo: TipoHabitacion): Promise<number>;
  contarHabitacionesActivas(): Promise<number>;
  verificarExistencia(id: string): Promise<boolean>;
  verificarNumeroDisponible(numero: string, excluirId?: string): Promise<boolean>;
  
  // Operaciones de gestión
  activarHabitacion(id: string): Promise<void>;
  desactivarHabitacion(id: string): Promise<void>;
  actualizarPrecio(id: string, nuevoPrecio: number): Promise<void>;
  
  // Búsquedas complejas
  buscarHabitacionesConOcupacion(periodo: Periodo): Promise<Array<{ habitacion: Habitacion; ocupada: boolean }>>;
  buscarHabitacionesPorRangoPrecio(precioMinimo: number, precioMaximo: number): Promise<Habitacion[]>;
}
