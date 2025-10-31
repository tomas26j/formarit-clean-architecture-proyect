import { ServicioDisponibilidad } from "../../services";
import { Habitacion } from "../../entities/room.js";
import { Reserva, EstadoReserva } from "../../entities/reservation.js";
import { Periodo } from "../../utils/types/lapse";
import { TipoHabitacion } from "../../utils/types/room-type";

export class ServicioDisponibilidadImpl implements ServicioDisponibilidad {
  
    async verificarDisponibilidad(habitacionId: string, periodo: Periodo): Promise<boolean> {
      // Este método será implementado por la capa de infraestructura
      // que tendrá acceso a los repositorios
      throw new Error('Método debe ser implementado por la capa de infraestructura');
    }
  
    async buscarHabitacionesDisponibles(periodo: Periodo, tipo?: TipoHabitacion): Promise<Habitacion[]> {
      // Este método será implementado por la capa de infraestructura
      throw new Error('Método debe ser implementado por la capa de infraestructura');
    }
  
    verificarDisponibilidadConReservas(habitacionId: string, periodo: Periodo, reservasExistentes: Reserva[]): boolean {
      // Filtrar reservas de la habitación específica
      const reservasHabitacion = reservasExistentes.filter(
        reserva => reserva.habitacionId === habitacionId
      );
  
      // Filtrar reservas que no están canceladas o completadas
      const reservasActivas = reservasHabitacion.filter(
        reserva => reserva.estado !== EstadoReserva.CANCELADA && 
                   reserva.estado !== EstadoReserva.CHECKOUT
      );
  
      // Verificar si hay superposición con alguna reserva activa
      return !reservasActivas.some(reserva => 
        periodo.seSuperponeCon(reserva.periodo)
      );
    }
  
    calcularTiempoLimpieza(habitacion: Habitacion): number {
      // Tiempo de limpieza basado en el tipo de habitación
      switch (habitacion.tipo.valor) {
        case 'individual':
          return 1; // 1 hora
        case 'doble':
          return 1.5; // 1.5 horas
        case 'suite':
          return 2; // 2 horas
        default:
          return 1; // Por defecto 1 hora
      }
    }
  
    verificarDisponibilidadConLimpieza(habitacionId: string, periodo: Periodo, reservasExistentes: Reserva[]): boolean {
      // Primero verificar disponibilidad básica
      if (!this.verificarDisponibilidadConReservas(habitacionId, periodo, reservasExistentes)) {
        return false;
      }
  
      // Buscar la habitación para calcular tiempo de limpieza
      // En una implementación real, esto vendría del repositorio
      const reservasHabitacion = reservasExistentes.filter(
        reserva => reserva.habitacionId === habitacionId
      );
  
      // Verificar si hay tiempo suficiente para limpieza entre reservas
      const reservasOrdenadas = reservasHabitacion
        .filter(reserva => reserva.estado === EstadoReserva.CHECKOUT)
        .sort((a, b) => a.periodo.checkOut.getTime() - b.periodo.checkOut.getTime());
  
      // Verificar si hay tiempo suficiente entre la última salida y el nuevo check-in
      if (reservasOrdenadas.length > 0) {
        const ultimaSalida = reservasOrdenadas[reservasOrdenadas.length - 1].periodo.checkOut;
        const tiempoLimpieza = 2; // 2 horas por defecto
        const tiempoMinimoEntreReservas = tiempoLimpieza * 60 * 60 * 1000; // en milisegundos
        
        const tiempoDisponible = periodo.checkIn.getTime() - ultimaSalida.getTime();
        
        if (tiempoDisponible < tiempoMinimoEntreReservas) {
          return false;
        }
      }
  
      return true;
    }
  
    // Método para verificar disponibilidad en un rango de fechas
    verificarDisponibilidadEnRango(
      habitacionId: string, 
      fechaInicio: Date, 
      fechaFin: Date, 
      reservasExistentes: Reserva[]
    ): boolean {
      const periodo = {
        checkIn: fechaInicio,
        checkOut: fechaFin,
        duracionEnNoches: () => Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)),
        seSuperponeCon: (otro: any) => fechaInicio < otro.checkOut && fechaFin > otro.checkIn,
        esFuturo: () => fechaInicio > new Date(),
        equals: (otro: any) => fechaInicio.getTime() === otro.checkIn.getTime() && fechaFin.getTime() === otro.checkOut.getTime()
      };
  
      return this.verificarDisponibilidadConReservas(habitacionId, periodo, reservasExistentes);
    }
  
    // Método para encontrar el próximo período disponible
    encontrarProximoPeriodoDisponible(
      habitacionId: string,
      duracionNoches: number,
      reservasExistentes: Reserva[]
    ): Date | null {
      const hoy = new Date();
      const maxDiasBusqueda = 365; // Buscar hasta 1 año en el futuro
      
      for (let i = 0; i < maxDiasBusqueda; i++) {
        const fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() + i);
        
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + duracionNoches);
        
        if (this.verificarDisponibilidadEnRango(habitacionId, fechaInicio, fechaFin, reservasExistentes)) {
          return fechaInicio;
        }
      }
      
      return null; // No se encontró disponibilidad
    }
  }