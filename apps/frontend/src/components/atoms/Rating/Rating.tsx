import { HTMLAttributes } from 'react'

export interface RatingProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  readonly?: boolean
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
}

const sizeClasses = {
  sm: 'rating-sm',
  md: '',
  lg: 'rating-lg',
}

export function Rating({
  value,
  max = 5,
  readonly = true,
  showValue = false,
  size = 'md',
  onChange,
  className = '',
  ...props
}: RatingProps) {
  const handleClick = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <div className={`rating ${sizeClasses[size]} ${readonly ? '' : 'cursor-pointer'}`}>
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= Math.round(value)
          const isHalf = !isFilled && starValue - 0.5 <= value
          return (
            <input
              key={starValue}
              type="radio"
              name={`rating-${Math.random()}`}
              className={`mask mask-star-2 ${isFilled ? 'bg-primary' : isHalf ? 'bg-primary/50' : 'bg-base-300'}`}
              checked={starValue === Math.round(value)}
              readOnly={readonly}
              onClick={() => handleClick(starValue)}
              onChange={() => handleClick(starValue)}
              aria-label={`${starValue} de ${max} estrellas`}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-base-content/70">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  )
}

