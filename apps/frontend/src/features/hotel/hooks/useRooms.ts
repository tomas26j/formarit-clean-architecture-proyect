/**
 * Hook para obtener habitaciones
 */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet } from '@/core/api/client'
import { endpoints } from '@/core/api/endpoints'
import { roomsListResponseSchema, roomSchema } from '@/core/api/schemas'
import { mapRoomsListDTO, mapRoomDTO } from '@/core/api/mappers'
import { Room } from '@/core/models/Room'
import { ApiClientError } from '@/core/api/client'

export interface UseRoomsParams {
  limit?: number
  offset?: number
  enabled?: boolean
}

export function useRooms(params?: UseRoomsParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: async () => {
      const endpoint = endpoints.habitaciones.list(params)
      const data = await apiGet<unknown>(endpoint)
      const validated = roomsListResponseSchema.parse(data)
      return mapRoomsListDTO(validated)
    },
    enabled: params?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useRoom(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const endpoint = endpoints.habitaciones.detail(id)
      const data = await apiGet<unknown>(endpoint)
      const validated = roomSchema.parse(data)
      return mapRoomDTO(validated)
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useRoomTypes() {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: async () => {
      const endpoint = endpoints.habitaciones.tipos()
      const data = await apiGet<{ tipos: unknown[] }>(endpoint)
      return data.tipos
    },
    staleTime: 1000 * 60 * 60, // 1 hora (los tipos no cambian frecuentemente)
  })
}

