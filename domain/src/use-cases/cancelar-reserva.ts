import { Reserva, EstadoReserva } from "../entities/reservation.js";
import { RepositorioReservas } from "../repositories/reserva-repository.js";

// DTOs para el caso de uso
export interface CancelarReservaCommand {
  reservaId: string;
  motivo: string;
  canceladoPor: string; // ID del usuario que cancela
}

export interface ReservaCanceladaResponse {
  reservaId: string;
  estado: string;
  canceladaEn: string;
  motivo: string;
  canceladoPor: string;
  penalizacion: {
    aplicada: boolean;
    monto: number;
    porcentaje: number;
  };
  reembolso: {
    monto: number;
    metodo: string;
  };
}

// Caso de Uso: Cancelar Reserva
export class CancelarReservaUseCase {
  constructor(
    private repositorioReservas: RepositorioReservas
  ) {}

  async execute(command: CancelarReservaCommand): Promise<ReservaCanceladaResponse> {
    // 1. Validar datos de entrada
    this.validarCommand(command);

    // 2. Buscar la reserva
    const reserva = await this.repositorioReservas.buscarPorId(command.reservaId);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // 3. Verificar que la reserva puede cancelarse
    if (!reserva.puedeCancelarse()) {
      throw new Error('Esta reserva no puede cancelarse en su estado actual');
    }

    // 4. Cancelar la reserva
    const reservaCancelada = reserva.cancelar(command.motivo);

    // 5. Calcular penalización
    const penalizacion = reservaCancelada.calcularPenalizacionCancelacion();

    // 6. Guardar la reserva cancelada
    await this.repositorioReservas.guardar(reservaCancelada);

    // 7. Calcular reembolso
    const reembolso = this.calcularReembolso(reservaCancelada, penalizacion);

    // 8. Retornar respuesta
    return {
      reservaId: reservaCancelada.id,
      estado: reservaCancelada.estado,
      canceladaEn: new Date().toISOString(),
      motivo: command.motivo,
      canceladoPor: command.canceladoPor,
      penalizacion: {
        aplicada: penalizacion.valor > 0,
        monto: penalizacion.valor,
        porcentaje: this.calcularPorcentajePenalizacion(reservaCancelada, penalizacion)
      },
      reembolso: {
        monto: reembolso.monto,
        metodo: reembolso.metodo
      }
    };
  }

  private validarCommand(command: CancelarReservaCommand): void {
    if (!command.reservaId || command.reservaId.trim().length === 0) {
      throw new Error('El ID de reserva es requerido');
    }

    if (!command.motivo || command.motivo.trim().length === 0) {
      throw new Error('El motivo de cancelación es requerido');
    }

    if (!command.canceladoPor || command.canceladoPor.trim().length === 0) {
      throw new Error('El ID del usuario que cancela es requerido');
    }

    // Validar longitud mínima del motivo
    if (command.motivo.trim().length < 10) {
      throw new Error('El motivo de cancelación debe tener al menos 10 caracteres');
    }
  }

  private calcularReembolso(reserva: Reserva, penalizacion: any): { monto: number; metodo: string } {
    const montoReembolso = reserva.precioTotal.valor - penalizacion.valor;
    
    return {
      monto: Math.max(0, montoReembolso), // No puede ser negativo
      metodo: 'mismo_metodo_pago' // En una implementación real, esto vendría de la reserva
    };
  }

  private calcularPorcentajePenalizacion(reserva: Reserva, penalizacion: any): number {
    if (reserva.precioTotal.valor === 0) {
      return 0;
    }
    
    return Math.round((penalizacion.valor / reserva.precioTotal.valor) * 100);
  }
}
