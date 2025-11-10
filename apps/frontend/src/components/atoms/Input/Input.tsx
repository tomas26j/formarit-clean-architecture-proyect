import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${props.name || 'default'}`

    return (
      <div className={`form-control ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text">{label}</span>
            {props.required && <span className="label-text-alt text-error">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <label className="label" id={`${inputId}-error`}>
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label" id={`${inputId}-helper`}>
            <span className="label-text-alt text-base-content/60">{helperText}</span>
          </label>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

