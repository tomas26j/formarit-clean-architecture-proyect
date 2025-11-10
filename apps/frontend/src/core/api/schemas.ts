/**
 * Esquemas Zod para validación
 * Adaptados a la estructura real del backend
 */
import { z } from 'zod'

// Esquema para Tipo de Habitación
export const roomTypeSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  capacidad: z.number(),
  precioBase: z.number().optional(),
  amenidades: z.array(z.string()).optional(),
})

// Esquema para Habitación (según estructura del backend)
export const roomSchema = z.object({
  id: z.string(),
  numero: z.string(),
  tipo: z.string(), // 'individual' | 'doble' | 'suite'
  precioBase: z.number(),
  activa: z.boolean(),
  piso: z.number().optional(),
  vista: z.string().optional(),
  capacidad: z.number(),
  amenidades: z.array(z.string()).optional(),
})

// Esquema para respuesta de lista de habitaciones
export const roomsListResponseSchema = z.object({
  habitaciones: z.array(roomSchema),
  total: z.number(),
  pagina: z.number().optional(),
  limite: z.number().optional(),
})

// Esquema para Disponibilidad
export const availabilitySchema = z.object({
  habitaciones: z.array(roomSchema),
})

// Esquema para Reserva (según estructura del backend)
export const reservationSchema = z.object({
  id: z.string(),
  habitacionId: z.string(),
  clienteId: z.string(),
  estado: z.enum(['pendiente', 'confirmada', 'cancelada']),
  checkIn: z.string(), // ISO date string
  checkOut: z.string(), // ISO date string
  precioTotal: z.number(),
  numeroHuespedes: z.number(),
  observaciones: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
})

// Esquema para respuesta de lista de reservas
export const reservationsListResponseSchema = z.object({
  reservas: z.array(reservationSchema),
  total: z.number(),
  pagina: z.number().optional(),
  limite: z.number().optional(),
})

// Esquema para crear reserva
export const createReservationSchema = z.object({
  habitacionId: z.string().min(1, 'El ID de la habitación es requerido'),
  clienteId: z.string().min(1, 'El ID del cliente es requerido'),
  checkIn: z.string().datetime('La fecha de check-in es inválida'),
  checkOut: z.string().datetime('La fecha de check-out es inválida'),
  numeroHuespedes: z.number().int().min(1, 'Debe haber al menos 1 huésped'),
  observaciones: z.string().max(500, 'Las observaciones no pueden exceder 500 caracteres').optional(),
})

// Esquema para confirmar reserva
export const confirmReservationSchema = z.object({
  metodoPago: z.enum(['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo']),
  numeroTarjeta: z.string().optional(),
  codigoSeguridad: z.string().optional(),
  fechaVencimiento: z.string().optional(),
}).refine(
  (data) => {
    // Si el método de pago es tarjeta, los campos de tarjeta son requeridos
    if (data.metodoPago === 'tarjeta_credito' || data.metodoPago === 'tarjeta_debito') {
      return data.numeroTarjeta && data.codigoSeguridad && data.fechaVencimiento
    }
    return true
  },
  {
    message: 'Los datos de la tarjeta son requeridos para pagos con tarjeta',
  }
)

// Esquema para cancelar reserva
export const cancelReservationSchema = z.object({
  motivo: z.string().min(10, 'El motivo debe tener al menos 10 caracteres').max(500, 'El motivo no puede exceder 500 caracteres'),
})

// Esquema para consultar disponibilidad
export const availabilityQuerySchema = z.object({
  checkIn: z.string().datetime('La fecha de check-in es inválida'),
  checkOut: z.string().datetime('La fecha de check-out es inválida'),
  tipoHabitacion: z.enum(['individual', 'doble', 'suite']).optional(),
  capacidadMinima: z.number().int().min(1).optional(),
  precioMaximo: z.number().positive().optional(),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    return checkOut > checkIn
  },
  {
    message: 'La fecha de check-out debe ser posterior a la fecha de check-in',
    path: ['checkOut'],
  }
)

