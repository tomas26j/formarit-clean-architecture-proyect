/**
 * Endpoints de la API
 * Adaptados a la estructura real del backend
 */

export const endpoints = {
  // Autenticación
  auth: {
    login: () => '/auth/login',
    register: () => '/auth/register',
    logout: () => '/auth/logout',
    refresh: () => '/auth/refresh',
  },

  // Habitaciones
  habitaciones: {
    list: (params?: {
      limit?: number
      offset?: number
    }) => {
      const query = new URLSearchParams()
      if (params?.limit) query.append('limit', params.limit.toString())
      if (params?.offset) query.append('offset', params.offset.toString())
      return `/habitaciones${query.toString() ? `?${query.toString()}` : ''}`
    },
    detail: (id: string) => `/habitaciones/${id}`,
    tipos: () => '/habitaciones/tipos',
    activar: (id: string) => `/habitaciones/${id}/activar`,
    desactivar: (id: string) => `/habitaciones/${id}/desactivar`,
  },

  // Disponibilidad
  disponibilidad: (params: {
    checkIn: string
    checkOut: string
    tipoHabitacion?: 'individual' | 'doble' | 'suite'
    capacidadMinima?: number
    precioMaximo?: number
  }) => {
    const query = new URLSearchParams()
    query.append('checkIn', params.checkIn)
    query.append('checkOut', params.checkOut)
    if (params.tipoHabitacion) query.append('tipoHabitacion', params.tipoHabitacion)
    if (params.capacidadMinima) query.append('capacidadMinima', params.capacidadMinima.toString())
    if (params.precioMaximo) query.append('precioMaximo', params.precioMaximo.toString())
    return `/reservas/disponibilidad?${query.toString()}`
  },

  // Reservas
  reservas: {
    list: (params?: {
      limit?: number
      offset?: number
    }) => {
      const query = new URLSearchParams()
      if (params?.limit) query.append('limit', params.limit.toString())
      if (params?.offset) query.append('offset', params.offset.toString())
      return `/reservas${query.toString() ? `?${query.toString()}` : ''}`
    },
    create: () => '/reservas',
    detail: (id: string) => `/reservas/${id}`,
    confirmar: (id: string) => `/reservas/${id}/confirmar`,
    cancelar: (id: string) => `/reservas/${id}/cancelar`,
  },

  // Health
  health: {
    check: () => '/health',
    detailed: () => '/health/detailed',
  },
} as const

