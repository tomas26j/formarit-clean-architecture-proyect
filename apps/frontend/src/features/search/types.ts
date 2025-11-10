/**
 * Tipos para el feature de búsqueda
 */
import type { GuestCount } from '@/components/molecules/GuestCounter'

export interface SearchParams {
  destino: string
  fechaInicio: Date | null
  fechaFin: Date | null
  huespedes: GuestCount
}

export interface SearchFilters {
  tipoHabitacion?: 'individual' | 'doble' | 'suite'
  precioMaximo?: number
  capacidadMinima?: number
}

