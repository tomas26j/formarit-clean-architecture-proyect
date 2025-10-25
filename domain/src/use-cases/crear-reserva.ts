import { Reserva, ReservaImpl, EstadoReserva } from "../entities/reservation.js";
import { Habitacion } from "../entities/room.js";
import { Periodo, PeriodoImpl } from "../utils/types/lapse.js";
import { Precio, PrecioImpl } from "../utils/types/precio.js";
import { RepositorioReservas } from "../repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";

// DTOs para el caso de uso
export interface CrearReservaCommand {
  habitacionId: string;
  clienteId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  numeroHuespedes: number;
  observaciones?: string;
}

export interface ReservaCreadaResponse {
  reservaId: string;
  estado: string;
  precioTotal: number;
  periodo: {
    checkIn: string;
    checkOut: string;
  };
  numeroHuespedes: number;
  observaciones?: string;
}

// Caso de Uso: Crear Reserva
export class CrearReservaUseCase {
  constructor(
    private repositorioReservas: RepositorioReservas,
    private repositorioHabitaciones: RepositorioHabitaciones,
    private servicioDisponibilidad: ServicioDisponibilidad,
    private servicioPrecios: ServicioCalculoPrecio
  ) {}

  async execute(command: CrearReservaCommand): Promise<ReservaCreadaResponse> {
    // 1. Validar datos de entrada
    this.validarCommand(command);

    // 2. Crear el período
    const periodo = PeriodoImpl.crear(
      new Date(command.checkIn),
      new Date(command.checkOut)
    );

    // 3. Verificar que la habitación existe
    const habitacion = await this.repositorioHabitaciones.buscarPorId(command.habitacionId);
    if (!habitacion) {
      throw new Error('Habitación no encontrada');
    }

    // 4. Verificar que la habitación puede reservarse
    if (!habitacion.puedeReservarse()) {
      throw new Error('La habitación no está disponible para reservas');
    }

    // 5. Verificar disponibilidad
    const disponible = await this.servicioDisponibilidad.verificarDisponibilidad(
      command.habitacionId,
      periodo
    );

    if (!disponible) {
      throw new Error('Habitación no disponible para las fechas solicitadas');
    }

    // 6. Verificar capacidad de la habitación
    if (command.numeroHuespedes > habitacion.tipo.capacidad) {
      throw new Error(`La habitación solo puede alojar ${habitacion.tipo.capacidad} huéspedes`);
    }

    // 7. Calcular precio total
    const precioTotal = this.servicioPrecios.calcularPrecio(habitacion, periodo);

    // 8. Generar ID único para la reserva
    const reservaId = this.generarId();

    // 9. Crear la reserva
    const reserva = ReservaImpl.crear(
      reservaId,
      command.habitacionId,
      command.clienteId,
      periodo,
      precioTotal,
      command.numeroHuespedes,
      command.observaciones
    );

    // 10. Guardar la reserva
    await this.repositorioReservas.guardar(reserva);

    // 11. Retornar respuesta
    return {
      reservaId: reserva.id,
      estado: reserva.estado,
      precioTotal: reserva.precioTotal.valor,
      periodo: {
        checkIn: reserva.periodo.checkIn.toISOString(),
        checkOut: reserva.periodo.checkOut.toISOString()
      },
      numeroHuespedes: reserva.numeroHuespedes,
      observaciones: reserva.observaciones
    };
  }

  private validarCommand(command: CrearReservaCommand): void {
    if (!command.habitacionId || command.habitacionId.trim().length === 0) {
      throw new Error('El ID de habitación es requerido');
    }

    if (!command.clienteId || command.clienteId.trim().length === 0) {
      throw new Error('El ID de cliente es requerido');
    }

    if (!command.checkIn || !command.checkOut) {
      throw new Error('Las fechas de check-in y check-out son requeridas');
    }

    if (command.numeroHuespedes <= 0) {
      throw new Error('El número de huéspedes debe ser mayor a 0');
    }

    // Validar formato de fechas
    const checkInDate = new Date(command.checkIn);
    const checkOutDate = new Date(command.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('Las fechas deben tener un formato válido');
    }
  }

  private generarId(): string {
    // En una implementación real, usarías un generador de UUID
    return `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
