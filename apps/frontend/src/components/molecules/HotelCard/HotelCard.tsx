import { Button } from '@/components/atoms'
import { Rating } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { formatCurrency } from '@/core/utils/format'
import type { Hotel } from '@/core/models/Hotel'

export interface HotelCardProps {
  hotel: Hotel
  precioDesde?: number
  onVerDetalles?: (hotelId: string) => void
  className?: string
}

export function HotelCard({ hotel, precioDesde, onVerDetalles, className = '' }: HotelCardProps) {
  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {/* Imagen */}
      <figure className="relative h-48 overflow-hidden">
        {hotel.imagenUrl ? (
          <img
            src={hotel.imagenUrl}
            alt={hotel.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <span className="text-base-content/40 text-4xl">🏨</span>
          </div>
        )}
        {hotel.rating && (
          <div className="absolute top-2 right-2 bg-base-100/90 backdrop-blur-sm px-2 py-1 rounded">
            <Rating value={hotel.rating} size="sm" />
          </div>
        )}
      </figure>

      {/* Contenido */}
      <div className="card-body">
        <h2 className="card-title text-xl">{hotel.nombre}</h2>
        <p className="text-sm text-base-content/70 flex items-center gap-1">
          <span>📍</span>
          {hotel.ubicacion}
        </p>

        {hotel.descripcion && (
          <p className="text-sm text-base-content/80 line-clamp-2">{hotel.descripcion}</p>
        )}

        {/* Servicios destacados */}
        {hotel.servicios && hotel.servicios.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hotel.servicios.slice(0, 3).map((servicio, index) => (
              <Badge key={index} variant="outline" size="sm">
                {servicio}
              </Badge>
            ))}
            {hotel.servicios.length > 3 && (
              <Badge variant="ghost" size="sm">
                +{hotel.servicios.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Precio y acción */}
        <div className="card-actions justify-between items-center mt-4">
          {precioDesde !== undefined && (
            <div>
              <p className="text-xs text-base-content/60">Desde</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(precioDesde)}</p>
              <p className="text-xs text-base-content/60">por noche</p>
            </div>
          )}
          <Button
            variant="primary"
            onClick={() => onVerDetalles?.(hotel.id)}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  )
}

