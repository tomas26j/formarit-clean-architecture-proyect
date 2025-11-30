import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useRoom } from '@/features/hotel/hooks/useRooms'
import { useCreateReservation } from '@/features/reservation/hooks/useReservations'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { PriceBreakdown } from '@/components/molecules/PriceBreakdown'
import { formatDateShort, calculateNights } from '@/core/utils/date'
import { formatCurrency } from '@/core/utils/format'
import { useToast } from '@/core/hooks/useToast'
import { ApiClientError } from '@/core/api/client'
import { useAuth } from '@/core/auth/AuthContext'
import { useState } from 'react'

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const adultos = parseInt(searchParams.get('adultos') || '2')
  const ninos = parseInt(searchParams.get('ninos') || '0')
  const bebes = parseInt(searchParams.get('bebes') || '0')

  const { data: room, isLoading, isError } = useRoom(id || '')
  const createReservation = useCreateReservation()
  const toast = useToast()
  const { user } = useAuth()

  const [isBooking, setIsBooking] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const handleBook = async () => {
    if (!id || !checkIn || !checkOut) {
      toast.error('Por favor, complete todas las fechas de la búsqueda')
      return
    }

    if (!user) {
      toast.error('Debes iniciar sesión para hacer una reserva')
      navigate('/login', { state: { from: location } })
      return
    }

    setIsBooking(true)
    try {
      // El backend usará automáticamente el userId del token JWT
      // Pero podemos enviarlo también para que el esquema valide
      const result = await createReservation.mutateAsync({
        habitacionId: id,
        clienteId: user.id, // Enviar el ID del usuario autenticado
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        numeroHuespedes: adultos + ninos + bebes,
      })

      toast.success('Reserva creada exitosamente')
      
      // Navegar a checkout con el ID de la reserva creada
      // El backend retorna la reserva completa o solo el ID
      const reservationId = (result as any)?.id || (result as any)?.reserva?.id || 'new'
      navigate('/checkout', { state: { reservationId } })
    } catch (error) {
      console.error('Error al crear reserva:', error)
      
      if (error instanceof ApiClientError) {
        toast.error(error.message || 'Error al crear la reserva')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocurrió un error inesperado al crear la reserva')
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">Cargando detalles de la habitación...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !room) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-error/10 border border-error/20 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-error">Habitación no encontrada</h2>
            <p className="text-base-content/70 mb-4">La habitación solicitada no existe o no está disponible.</p>
            <Button variant="primary" onClick={handleBack}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0
  const totalPrice = room.precioPorNoche * nights

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
          ← Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Image */}
            <div className="card bg-base-200 p-0 overflow-hidden">
              {room.imagenUrl ? (
                <img src={room.imagenUrl} alt={room.tipo} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-base-300 flex items-center justify-center">
                  <span className="text-6xl">🏨</span>
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="card bg-base-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{room.tipo}</h1>
                  <p className="text-base-content/70">{room.descripcion}</p>
                </div>
                <Badge variant="success">Disponible</Badge>
              </div>

              {/* Amenities */}
              {room.amenidades && room.amenidades.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Amenidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenidades.map((amenidad, index) => (
                      <Badge key={index} variant="info">
                        {amenidad}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Capacidad</h3>
                <p className="text-base-content/70">Hasta {room.capacidad} huéspedes</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4">Resumen de reserva</h2>

              {/* Dates */}
              {checkIn && checkOut && (
                <div className="space-y-2 mb-6">
                  <div>
                    <p className="text-sm text-base-content/60">Check-in</p>
                    <p className="font-medium">{formatDateShort(new Date(checkIn))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Check-out</p>
                    <p className="font-medium">{formatDateShort(new Date(checkOut))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Noches</p>
                    <p className="font-medium">{nights} {nights === 1 ? 'noche' : 'noches'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Huéspedes</p>
                    <p className="font-medium">
                      {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
                      {ninos > 0 && `, ${ninos} ${ninos === 1 ? 'niño' : 'niños'}`}
                      {bebes > 0 && `, ${bebes} ${bebes === 1 ? 'bebé' : 'bebés'}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <PriceBreakdown
                items={[
                  {
                    label: `${nights} ${nights === 1 ? 'noche' : 'noches'}`,
                    value: room.precioPorNoche * nights,
                    description: `${formatCurrency(room.precioPorNoche)} por noche`,
                  },
                ]}
                subtotal={room.precioPorNoche * nights}
                impuestos={room.precioPorNoche * nights * 0.21} // 21% IVA
                total={totalPrice * 1.21}
              />

              {/* Book Button */}
              <Button
                variant="primary"
                className="w-full mt-6"
                onClick={handleBook}
                loading={isBooking || createReservation.isPending}
                disabled={!checkIn || !checkOut}
              >
                Reservar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

