import { Reserva, EstadoReserva } from "../entities/reservation.js";
import { RepositorioReservas } from "../repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service(deprecated).js";

// DTOs para el caso de uso
export interface ConfirmarReservaCommand {
  reservaId: string;
  metodoPago: string;
  numeroTarjeta?: string;
  codigoSeguridad?: string;
  fechaVencimiento?: string;
}

export interface ReservaConfirmadaResponse {
  reservaId: string;
  estado: string;
  confirmadaEn: string;
  metodoPago: string;
  precioTotal: number;
  periodo: {
    checkIn: string;
    checkOut: string;
  };
}

// Caso de Uso: Confirmar Reserva
export class ConfirmarReservaUseCase {
  constructor(
    private repositorioReservas: RepositorioReservas,
    private repositorioHabitaciones: RepositorioHabitaciones,
    private servicioDisponibilidad: ServicioDisponibilidad
  ) {}

  async execute(command: ConfirmarReservaCommand): Promise<ReservaConfirmadaResponse> {
    // 1. Validar datos de entrada
    this.validarCommand(command);

    // 2. Buscar la reserva
    const reserva = await this.repositorioReservas.buscarPorId(command.reservaId);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // 3. Verificar que la reserva puede confirmarse
    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      throw new Error('Solo las reservas pendientes pueden confirmarse');
    }

    // 4. Verificar disponibilidad nuevamente (por posibles cambios)
    const disponible = await this.servicioDisponibilidad.verificarDisponibilidad(
      reserva.habitacionId,
      reserva.periodo
    );

    if (!disponible) {
      throw new Error('La habitación ya no está disponible para las fechas de la reserva');
    }

    // 5. Validar método de pago
    this.validarMetodoPago(command);

    // 6. Confirmar la reserva
    const reservaConfirmada = reserva.confirmar();

    // 7. Guardar la reserva confirmada
    await this.repositorioReservas.guardar(reservaConfirmada);

    // 8. Retornar respuesta
    return {
      reservaId: reservaConfirmada.id,
      estado: reservaConfirmada.estado,
      confirmadaEn: new Date().toISOString(),
      metodoPago: command.metodoPago,
      precioTotal: reservaConfirmada.precioTotal.valor,
      periodo: {
        checkIn: reservaConfirmada.periodo.checkIn.toISOString(),
        checkOut: reservaConfirmada.periodo.checkOut.toISOString()
      }
    };
  }

  private validarCommand(command: ConfirmarReservaCommand): void {
    if (!command.reservaId || command.reservaId.trim().length === 0) {
      throw new Error('El ID de reserva es requerido');
    }

    if (!command.metodoPago || command.metodoPago.trim().length === 0) {
      throw new Error('El método de pago es requerido');
    }

    // Validar métodos de pago válidos
    const metodosValidos = ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo'];
    if (!metodosValidos.includes(command.metodoPago)) {
      throw new Error('Método de pago no válido');
    }
  }

  private validarMetodoPago(command: ConfirmarReservaCommand): void {
    if (command.metodoPago === 'tarjeta_credito' || command.metodoPago === 'tarjeta_debito') {
      if (!command.numeroTarjeta || command.numeroTarjeta.trim().length === 0) {
        throw new Error('El número de tarjeta es requerido para pagos con tarjeta');
      }

      if (!command.codigoSeguridad || command.codigoSeguridad.trim().length === 0) {
        throw new Error('El código de seguridad es requerido para pagos con tarjeta');
      }

      if (!command.fechaVencimiento || command.fechaVencimiento.trim().length === 0) {
        throw new Error('La fecha de vencimiento es requerida para pagos con tarjeta');
      }

      // Validar formato del número de tarjeta (básico)
      if (!/^\d{13,19}$/.test(command.numeroTarjeta.replace(/\s/g, ''))) {
        throw new Error('El número de tarjeta debe tener entre 13 y 19 dígitos');
      }

      // Validar código de seguridad
      if (!/^\d{3,4}$/.test(command.codigoSeguridad)) {
        throw new Error('El código de seguridad debe tener 3 o 4 dígitos');
      }

      // Validar fecha de vencimiento
      const fechaVencimiento = new Date(command.fechaVencimiento!);
      if (isNaN(fechaVencimiento.getTime()) || fechaVencimiento < new Date()) {
        throw new Error('La fecha de vencimiento debe ser válida y futura');
      }
    }
  }
}
