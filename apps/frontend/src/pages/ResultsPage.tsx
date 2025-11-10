import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAvailability } from '@/features/search/hooks/useAvailability'
import { RoomCard } from '@/components/molecules/RoomCard'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { useToast } from '@/core/hooks/useToast'
import { ApiClientError } from '@/core/api/client'
import { formatDateShort } from '@/core/utils/date'

export function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  // Obtener parámetros de búsqueda
  const destino = searchParams.get('destino') || ''
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const adultos = parseInt(searchParams.get('adultos') || '2')
  const ninos = parseInt(searchParams.get('ninos') || '0')
  const bebes = parseInt(searchParams.get('bebes') || '0')

  const capacidadMinima = adultos + ninos

  // Consultar disponibilidad
  const {
    data: availability,
    isLoading,
    isError,
    error,
  } = useAvailability({
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    capacidadMinima,
    enabled: !!checkIn && !!checkOut,
  })

  // Mostrar error si hay problema con la búsqueda (solo una vez)
  useEffect(() => {
    if (isError && error) {
      if (error instanceof ApiClientError) {
        toast.error(error.message || 'Error al buscar habitaciones disponibles')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocurrió un error al buscar habitaciones')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  const handleRoomSelect = (roomId: string) => {
    // Navegar a la página de detalle con los parámetros de búsqueda
    const params = new URLSearchParams({
      roomId,
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      adultos: adultos.toString(),
      ninos: ninos.toString(),
      bebes: bebes.toString(),
    })
    navigate(`/habitacion/${roomId}?${params.toString()}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">Buscando habitaciones disponibles...</p>
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
            <h2 className="text-2xl font-semibold mb-4 text-error">Error al buscar habitaciones</h2>
            <p className="text-base-content/70 mb-4">
              {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
            </p>
            <Button variant="primary" onClick={handleBack}>
              Volver a búsqueda
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const habitaciones = availability?.habitaciones || []

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
            ← Volver a búsqueda
          </Button>
          <div className="card bg-base-200 p-6">
            <h1 className="text-3xl font-bold mb-4">Habitaciones disponibles</h1>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Destino:</strong> {destino}
              </p>
              <p>
                <strong>Check-in:</strong> {checkIn ? formatDateShort(new Date(checkIn)) : '-'}
              </p>
              <p>
                <strong>Check-out:</strong> {checkOut ? formatDateShort(new Date(checkOut)) : '-'}
              </p>
              <p>
                <strong>Huéspedes:</strong> {adultos} adultos, {ninos} niños, {bebes} bebés
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {habitaciones.length === 0 ? (
          <div className="card bg-base-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-4">No se encontraron habitaciones</h2>
            <p className="text-base-content/70 mb-6">
              No hay habitaciones disponibles para las fechas y criterios seleccionados.
            </p>
            <Button variant="primary" onClick={handleBack}>
              Modificar búsqueda
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base-content/70">
                Se encontraron <strong>{habitaciones.length}</strong> habitaciones disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habitaciones.map((habitacion) => (
                <RoomCard
                  key={habitacion.id}
                  room={habitacion}
                  disponible={true}
                  onReservar={() => handleRoomSelect(habitacion.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

