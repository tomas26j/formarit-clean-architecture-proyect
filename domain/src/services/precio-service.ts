import { Habitacion } from "../entities/room.js";
import { Periodo } from "../utils/types/lapse.js";
import { Precio, PrecioImpl } from "../utils/types/precio.js";
import { TipoHabitacion } from "../utils/types/room-type.js";

// Servicio de Dominio: Cálculo de Precios
export interface ServicioCalculoPrecio {
  calcularPrecio(habitacion: Habitacion, periodo: Periodo): Precio;
  calcularPrecioConDescuento(habitacion: Habitacion, periodo: Periodo, descuento: number): Precio;
  calcularPrecioTemporada(habitacion: Habitacion, periodo: Periodo, factorTemporada: number): Precio;
  calcularPrecioGrupo(habitacion: Habitacion, periodo: Periodo, numeroHuespedes: number): Precio;
}

export class ServicioCalculoPrecioImpl implements ServicioCalculoPrecio {
  
  calcularPrecio(habitacion: Habitacion, periodo: Periodo): Precio {
    const duracionNoches = periodo.duracionEnNoches();
    return habitacion.calcularPrecioTotal(duracionNoches);
  }

  calcularPrecioConDescuento(habitacion: Habitacion, periodo: Periodo, descuento: number): Precio {
    const precioBase = this.calcularPrecio(habitacion, periodo);
    return precioBase.aplicarDescuento(descuento);
  }

  calcularPrecioTemporada(habitacion: Habitacion, periodo: Periodo, factorTemporada: number): Precio {
    if (factorTemporada <= 0) {
      throw new Error('El factor de temporada debe ser mayor a 0');
    }
    
    const precioBase = this.calcularPrecio(habitacion, periodo);
    return precioBase.multiplicar(factorTemporada);
  }

  calcularPrecioGrupo(habitacion: Habitacion, periodo: Periodo, numeroHuespedes: number): Precio {
    if (numeroHuespedes <= 0) {
      throw new Error('El número de huéspedes debe ser mayor a 0');
    }
    
    const precioBase = this.calcularPrecio(habitacion, periodo);
    
    // Aplicar recargo por huésped adicional (más allá de la capacidad base)
    const capacidadBase = habitacion.tipo.capacidad;
    if (numeroHuespedes > capacidadBase) {
      const huéspedesAdicionales = numeroHuespedes - capacidadBase;
      const recargoPorHuesped = precioBase.multiplicar(0.1); // 10% por huésped adicional
      const recargoTotal = recargoPorHuesped.multiplicar(huéspedesAdicionales);
      return precioBase.sumar(recargoTotal);
    }
    
    return precioBase;
  }

  // Método para determinar factor de temporada basado en fechas
  determinarFactorTemporada(periodo: Periodo): number {
    const mes = periodo.checkIn.getMonth() + 1; // getMonth() retorna 0-11
    
    // Temporada alta: Diciembre, Enero, Febrero, Julio, Agosto
    if ([12, 1, 2, 7, 8].includes(mes)) {
      return 1.5; // 50% más caro
    }
    
    // Temporada media: Marzo, Abril, Mayo, Septiembre, Octubre
    if ([3, 4, 5, 9, 10].includes(mes)) {
      return 1.2; // 20% más caro
    }
    
    // Temporada baja: Junio, Noviembre
    return 1.0; // Precio base
  }

  // Método para calcular descuentos por duración de estadía
  calcularDescuentoPorDuracion(duracionNoches: number): number {
    if (duracionNoches >= 7) {
      return 15; // 15% de descuento por estadías de 7+ noches
    } else if (duracionNoches >= 3) {
      return 5; // 5% de descuento por estadías de 3+ noches
    }
    
    return 0; // Sin descuento
  }
}
