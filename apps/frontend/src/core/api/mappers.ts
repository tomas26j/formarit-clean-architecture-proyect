/**
 * Mappers para convertir DTOs del backend a modelos de dominio
 * Adaptados a la estructura real del backend
 */
import { Room } from '../models/Room'
import { Reservation } from '../models/Reservation'
import { Availability } from '../models/Availability'

// Tipos DTO del backend (según estructura real)
export interface RoomDTO {
  id: string
  numero: string
  tipo: string // 'individual' | 'doble' | 'suite'
  precioBase: number
  activa: boolean
  piso?: number
  vista?: string
  capacidad: number
  amenidades?: string[]
}

export interface RoomsListResponseDTO {
  habitaciones: RoomDTO[]
  total: number
  pagina?: number
  limite?: number
}

export interface ReservationDTO {
  id: string
  habitacionId: string
  clienteId: string
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  checkIn: string // ISO date string
  checkOut: string // ISO date string
  precioTotal: number
  numeroHuespedes: number
  observaciones?: string
  fechaCreacion?: string
  fechaActualizacion?: string
}

export interface ReservationsListResponseDTO {
  reservas: ReservationDTO[]
  total: number
  pagina?: number
  limite?: number
}

export interface AvailabilityResponseDTO {
  habitaciones: RoomDTO[]
}

/**
 * Mapea un DTO de habitación a modelo de dominio
 * Nota: El modelo Room del frontend usa hotelId, pero el backend no tiene hoteles.
 * Usamos un valor por defecto o null para mantener compatibilidad.
 */
export function mapRoomDTO(dto: RoomDTO): Room {
  return {
    id: dto.id,
    hotelId: 'default', // El backend no tiene hoteles, usamos un valor por defecto
    tipo: dto.tipo,
    descripcion: `Habitación ${dto.numero} - ${dto.tipo}${dto.vista ? ` - ${dto.vista}` : ''}`,
    capacidad: dto.capacidad,
    precioPorNoche: dto.precioBase,
    imagenUrl: undefined, // El backend no incluye imagenUrl
    amenidades: dto.amenidades || [],
  }
}

/**
 * Mapea una lista de DTOs de habitaciones a modelos de dominio
 */
export function mapRoomsListDTO(dto: RoomsListResponseDTO): Room[] {
  return dto.habitaciones.map(mapRoomDTO)
}

/**
 * Mapea un DTO de reserva a modelo de dominio
 */
export function mapReservationDTO(dto: ReservationDTO): Reservation {
  return {
    id: dto.id,
    hotelId: 'default', // El backend no tiene hoteles
    habitacionId: dto.habitacionId,
    checkIn: new Date(dto.checkIn),
    checkOut: new Date(dto.checkOut),
    huesped: {
      nombre: '', // El backend no incluye datos del huésped en la respuesta
      email: '',
      telefono: '',
    },
    medioPago: '', // El backend no incluye medio de pago en la respuesta básica
    estado: dto.estado,
    precioTotal: dto.precioTotal,
  }
}

/**
 * Mapea una lista de DTOs de reservas a modelos de dominio
 */
export function mapReservationsListDTO(dto: ReservationsListResponseDTO): Reservation[] {
  return dto.reservas.map(mapReservationDTO)
}

/**
 * Mapea un DTO de disponibilidad a modelo de dominio
 */
export function mapAvailabilityDTO(dto: AvailabilityResponseDTO): Availability {
  return {
    hotelId: 'default', // El backend no tiene hoteles
    checkIn: new Date(), // Se debe proporcionar desde el query
    checkOut: new Date(), // Se debe proporcionar desde el query
    habitaciones: dto.habitaciones.map(mapRoomDTO),
  }
}


