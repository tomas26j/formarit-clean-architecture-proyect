import { SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  fullWidth?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      fullWidth = false,
      placeholder,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = props.id || `select-${props.name || 'default'}`

    return (
      <div className={`form-control ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="label">
            <span className="label-text">{label}</span>
            {props.required && <span className="label-text-alt text-error">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`select select-bordered w-full ${error ? 'select-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <label className="label" id={`${selectId}-error`}>
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label" id={`${selectId}-helper`}>
            <span className="label-text-alt text-base-content/60">{helperText}</span>
          </label>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

