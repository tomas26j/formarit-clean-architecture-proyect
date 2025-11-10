/**
 * Hook para consultar disponibilidad
 */
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/core/api/client'
import { endpoints } from '@/core/api/endpoints'
import { availabilitySchema, availabilityQuerySchema } from '@/core/api/schemas'
import { mapAvailabilityDTO } from '@/core/api/mappers'
import { Availability } from '@/core/models/Availability'

export interface UseAvailabilityParams {
  checkIn: string
  checkOut: string
  tipoHabitacion?: 'individual' | 'doble' | 'suite'
  capacidadMinima?: number
  precioMaximo?: number
  enabled?: boolean
}

export function useAvailability(params: UseAvailabilityParams) {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: async () => {
      // Validar parámetros antes de hacer la petición
      const validatedParams = availabilityQuerySchema.parse({
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        tipoHabitacion: params.tipoHabitacion,
        capacidadMinima: params.capacidadMinima,
        precioMaximo: params.precioMaximo,
      })

      const endpoint = endpoints.disponibilidad(validatedParams)
      const data = await apiGet<unknown>(endpoint)
      const validated = availabilitySchema.parse(data)
      
      // Mapear y agregar fechas del query
      const availability = mapAvailabilityDTO(validated)
      availability.checkIn = new Date(params.checkIn)
      availability.checkOut = new Date(params.checkOut)
      
      return availability
    },
    enabled: params.enabled !== false && !!params.checkIn && !!params.checkOut,
    staleTime: 1000 * 60 * 2, // 2 minutos (la disponibilidad puede cambiar)
  })
}

