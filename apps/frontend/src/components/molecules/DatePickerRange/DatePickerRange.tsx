import { Input } from '@/components/atoms'
import { formatDateShort, isValidDateRange } from '@/core/utils/date'

export interface DateRange {
  checkIn: Date | null
  checkOut: Date | null
}

export interface DatePickerRangeProps {
  value: DateRange
  onChange: (range: DateRange) => void
  minDate?: Date
  minNights?: number
  className?: string
}

export function DatePickerRange({
  value,
  onChange,
  minDate = new Date(),
  minNights = 1,
  className = '',
}: DatePickerRangeProps) {
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDateFromInput = (dateString: string): Date | null => {
    if (!dateString) return null
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  }

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkIn = parseDateFromInput(e.target.value)
    const newRange: DateRange = {
      checkIn,
      checkOut: value.checkOut,
    }

    // Si checkOut es anterior a checkIn, resetear checkOut
    if (checkIn && value.checkOut && value.checkOut <= checkIn) {
      newRange.checkOut = null
    }

    onChange(newRange)
  }

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkOut = parseDateFromInput(e.target.value)
    onChange({
      checkIn: value.checkIn,
      checkOut,
    })
  }

  const getMinCheckOut = (): string => {
    if (!value.checkIn) return formatDateForInput(minDate)
    const minCheckOut = new Date(value.checkIn)
    minCheckOut.setDate(minCheckOut.getDate() + minNights)
    return formatDateForInput(minCheckOut)
  }

  const getError = (): string | undefined => {
    if (value.checkIn && value.checkOut) {
      if (!isValidDateRange(value.checkIn, value.checkOut)) {
        return 'La fecha de salida debe ser posterior a la de entrada'
      }
      const nights = Math.ceil(
        (value.checkOut.getTime() - value.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (nights < minNights) {
        return `Mínimo ${minNights} ${minNights === 1 ? 'noche' : 'noches'} requeridas`
      }
    }
    return undefined
  }

  const error = getError()

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Check-in"
          type="date"
          value={formatDateForInput(value.checkIn)}
          onChange={handleCheckInChange}
          min={formatDateForInput(minDate)}
          required
        />
        <Input
          label="Check-out"
          type="date"
          value={formatDateForInput(value.checkOut)}
          onChange={handleCheckOutChange}
          min={getMinCheckOut()}
          required
          error={error}
        />
      </div>

      {value.checkIn && value.checkOut && !error && (
        <div className="text-sm text-base-content/70 p-3 bg-base-200 rounded-lg">
          <p>
            <strong>Check-in:</strong> {formatDateShort(value.checkIn)}
          </p>
          <p>
            <strong>Check-out:</strong> {formatDateShort(value.checkOut)}
          </p>
          <p className="mt-1">
            <strong>Noches:</strong>{' '}
            {Math.ceil(
              (value.checkOut.getTime() - value.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            )}
          </p>
        </div>
      )}
    </div>
  )
}

