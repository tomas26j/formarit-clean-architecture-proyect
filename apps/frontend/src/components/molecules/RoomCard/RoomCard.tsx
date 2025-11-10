import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { formatCurrency } from '@/core/utils/format'
import type { Room } from '@/core/models/Room'

export interface RoomCardProps {
  room: Room
  disponible?: boolean
  onReservar?: (roomId: string) => void
  className?: string
}

export function RoomCard({ room, disponible = true, onReservar, className = '' }: RoomCardProps) {
  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {/* Imagen */}
      <figure className="relative h-40 overflow-hidden">
        {room.imagenUrl ? (
          <img
            src={room.imagenUrl}
            alt={room.tipo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <span className="text-base-content/40 text-3xl">🛏️</span>
          </div>
        )}
        {!disponible && (
          <div className="absolute inset-0 bg-base-content/50 flex items-center justify-center">
            <Badge variant="error" size="lg">
              No disponible
            </Badge>
          </div>
        )}
      </figure>

      {/* Contenido */}
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-lg">{room.tipo}</h3>
            <p className="text-sm text-base-content/70">
              Capacidad: {room.capacidad} {room.capacidad === 1 ? 'huésped' : 'huéspedes'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatCurrency(room.precioPorNoche)}</p>
            <p className="text-xs text-base-content/60">por noche</p>
          </div>
        </div>

        {room.descripcion && (
          <p className="text-sm text-base-content/80 line-clamp-2 mt-2">{room.descripcion}</p>
        )}

        {/* Amenidades */}
        {room.amenidades && room.amenidades.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-base-content/60 mb-2">Amenidades:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenidades.map((amenidad, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {amenidad}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Acción */}
        <div className="card-actions mt-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => onReservar?.(room.id)}
            disabled={!disponible}
          >
            {disponible ? 'Reservar' : 'No disponible'}
          </Button>
        </div>
      </div>
    </div>
  )
}

