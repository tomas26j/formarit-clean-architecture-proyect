import { useState } from 'react'
import { Input } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { DatePickerRange } from '../DatePickerRange'
import { GuestCounter } from '../GuestCounter'
import type { DateRange } from '../DatePickerRange'
import type { GuestCount } from '../GuestCounter'

export interface SearchParams {
  destino: string
  fechaInicio: Date | null
  fechaFin: Date | null
  huespedes: GuestCount
}

export interface SearchBarProps {
  onSearch: (params: SearchParams) => void
  initialValues?: Partial<SearchParams>
  loading?: boolean
  className?: string
}

export function SearchBar({ onSearch, initialValues, loading = false, className = '' }: SearchBarProps) {
  const [destino, setDestino] = useState(initialValues?.destino || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: initialValues?.fechaInicio || null,
    checkOut: initialValues?.fechaFin || null,
  })
  const [huespedes, setHuespedes] = useState<GuestCount>(
    initialValues?.huespedes || { adultos: 2, ninos: 0, bebes: 0 }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      destino,
      fechaInicio: dateRange.checkIn,
      fechaFin: dateRange.checkOut,
      huespedes,
    })
  }

  const isValid = destino.trim() !== '' && dateRange.checkIn && dateRange.checkOut

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Destino */}
      <Input
        label="Destino"
        placeholder="¿A dónde viajas?"
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        required
      />

      {/* Fechas */}
      <DatePickerRange value={dateRange} onChange={setDateRange} />

      {/* Huéspedes */}
      <div className="card bg-base-200 p-4">
        <label className="font-medium mb-3 block">Huéspedes</label>
        <GuestCounter value={huespedes} onChange={setHuespedes} />
      </div>

      {/* Botón de búsqueda */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={loading}
        disabled={!isValid || loading}
      >
        Buscar hoteles
      </Button>
    </form>
  )
}

