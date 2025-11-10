import { useNavigate, useLocation } from 'react-router-dom'
import { useReservations } from '@/features/reservation/hooks/useReservations'
import { useCancelReservation } from '@/features/reservation/hooks/useReservations'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { formatDateShort, calculateNights } from '@/core/utils/date'
import { formatCurrency } from '@/core/utils/format'
import { useToast } from '@/core/hooks/useToast'
import { ApiClientError } from '@/core/api/client'
import { useState, useEffect } from 'react'

export function ReservationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: reservations, isLoading, isError } = useReservations()
  const cancelReservation = useCancelReservation()
  const toast = useToast()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  // Mostrar toast de éxito si viene de checkout
  useEffect(() => {
    if (location.state?.success) {
      toast.success('Reserva confirmada exitosamente')
      // Limpiar el estado para que no se muestre de nuevo
      window.history.replaceState({}, document.title)
    }
  }, [location.state, toast])

  const handleCancel = async (id: string) => {
    if (!confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      return
    }

    setCancellingId(id)
    try {
      await cancelReservation.mutateAsync({
        id,
        data: {
          motivo: 'Cancelación solicitada por el cliente',
        },
      })
      toast.success('Reserva cancelada exitosamente')
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
      
      if (error instanceof ApiClientError) {
        toast.error(error.message || 'Error al cancelar la reserva')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocurrió un error inesperado al cancelar la reserva')
      }
    } finally {
      setCancellingId(null)
    }
  }

  const handleViewDetails = (id: string) => {
    navigate(`/reservas/${id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">Cargando reservas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-error/10 border border-error/20 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-error">Error al cargar reservas</h2>
            <p className="text-base-content/70 mb-4">No se pudieron cargar las reservas. Por favor, intente más tarde.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const reservas = reservations || []

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Mis reservas</h1>
          <p className="text-base-content/70">Gestiona todas tus reservas aquí</p>
        </div>

        {reservas.length === 0 ? (
          <div className="card bg-base-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-4">No tienes reservas</h2>
            <p className="text-base-content/70 mb-6">
              Aún no has realizado ninguna reserva. ¡Comienza a buscar habitaciones disponibles!
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Buscar habitaciones
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => {
              const nights = calculateNights(reserva.checkIn, reserva.checkOut)
              const estadoColors = {
                pendiente: 'warning',
                confirmada: 'success',
                cancelada: 'error',
              } as const

              return (
                <div key={reserva.id} className="card bg-base-100 shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">Reserva #{reserva.id.slice(0, 8)}</h3>
                            <Badge variant={estadoColors[reserva.estado]}>
                              {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-base-content/70">
                            <p>
                              <strong>Check-in:</strong> {formatDateShort(reserva.checkIn)}
                            </p>
                            <p>
                              <strong>Check-out:</strong> {formatDateShort(reserva.checkOut)}
                            </p>
                            <p>
                              <strong>Noches:</strong> {nights} {nights === 1 ? 'noche' : 'noches'}
                            </p>
                            <p>
                              <strong>Total:</strong> {formatCurrency(reserva.precioTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(reserva.id)}
                      >
                        Ver detalles
                      </Button>
                      {reserva.estado !== 'cancelada' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(reserva.id)}
                          loading={cancellingId === reserva.id}
                          disabled={cancellingId === reserva.id}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

