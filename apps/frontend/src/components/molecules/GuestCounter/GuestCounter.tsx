import { Button } from '@/components/atoms'

export interface GuestCount {
  adultos: number
  ninos: number
  bebes: number
}

export interface GuestCounterProps {
  value: GuestCount
  onChange: (value: GuestCount) => void
  minAdults?: number
  maxAdults?: number
  maxNinos?: number
  maxBebes?: number
  className?: string
}

export function GuestCounter({
  value,
  onChange,
  minAdults = 1,
  maxAdults = 10,
  maxNinos = 5,
  maxBebes = 2,
  className = '',
}: GuestCounterProps) {
  const updateCount = (
    type: keyof GuestCount,
    delta: number,
    min: number = 0,
    max: number = Infinity
  ) => {
    const newValue = { ...value }
    const currentValue = newValue[type]
    const newCount = Math.max(min, Math.min(max, currentValue + delta))
    newValue[type] = newCount
    onChange(newValue)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Adultos */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium">Adultos</label>
          <p className="text-sm text-base-content/60">Mayores de 18 años</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('adultos', -1, minAdults, maxAdults)}
            disabled={value.adultos <= minAdults}
          >
            −
          </Button>
          <span className="w-8 text-center font-semibold">{value.adultos}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('adultos', 1, minAdults, maxAdults)}
            disabled={value.adultos >= maxAdults}
          >
            +
          </Button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium">Niños</label>
          <p className="text-sm text-base-content/60">De 2 a 17 años</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('ninos', -1, 0, maxNinos)}
            disabled={value.ninos <= 0}
          >
            −
          </Button>
          <span className="w-8 text-center font-semibold">{value.ninos}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('ninos', 1, 0, maxNinos)}
            disabled={value.ninos >= maxNinos}
          >
            +
          </Button>
        </div>
      </div>

      {/* Bebés */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium">Bebés</label>
          <p className="text-sm text-base-content/60">Menores de 2 años</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('bebes', -1, 0, maxBebes)}
            disabled={value.bebes <= 0}
          >
            −
          </Button>
          <span className="w-8 text-center font-semibold">{value.bebes}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCount('bebes', 1, 0, maxBebes)}
            disabled={value.bebes >= maxBebes}
          >
            +
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-base-300">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total huéspedes</span>
          <span className="text-lg font-bold text-primary">
            {value.adultos + value.ninos + value.bebes}
          </span>
        </div>
      </div>
    </div>
  )
}

