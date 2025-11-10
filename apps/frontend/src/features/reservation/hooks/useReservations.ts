/**
 * Hook para gestionar reservas
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, ApiClientError } from '@/core/api/client'
import { endpoints } from '@/core/api/endpoints'
import {
  reservationsListResponseSchema,
  reservationSchema,
  createReservationSchema,
  confirmReservationSchema,
  cancelReservationSchema,
} from '@/core/api/schemas'
import { mapReservationsListDTO, mapReservationDTO } from '@/core/api/mappers'
import { Reservation } from '@/core/models/Reservation'

export interface UseReservationsParams {
  limit?: number
  offset?: number
  enabled?: boolean
}

export function useReservations(params?: UseReservationsParams) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: async () => {
      const endpoint = endpoints.reservas.list(params)
      const data = await apiGet<unknown>(endpoint)
      const validated = reservationsListResponseSchema.parse(data)
      return mapReservationsListDTO(validated)
    },
    enabled: params?.enabled !== false,
    staleTime: 1000 * 60 * 2, // 2 minutos (las reservas pueden cambiar)
  })
}

export function useReservation(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: async () => {
      const endpoint = endpoints.reservas.detail(id)
      const data = await apiGet<unknown>(endpoint)
      const validated = reservationSchema.parse(data)
      return mapReservationDTO(validated)
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: unknown) => {
      // Validar datos antes de enviar
      const validated = createReservationSchema.parse(data)
      const endpoint = endpoints.reservas.create()
      const response = await apiPost<unknown>(endpoint, validated)
      return response
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useConfirmReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const validated = confirmReservationSchema.parse(data)
      const endpoint = endpoints.reservas.confirmar(id)
      const response = await apiPost<unknown>(endpoint, validated)
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservation', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const validated = cancelReservationSchema.parse(data)
      const endpoint = endpoints.reservas.cancelar(id)
      const response = await apiPost<unknown>(endpoint, validated)
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservation', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

