import { HTMLAttributes, ImgHTMLAttributes } from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  placeholder?: string
  online?: boolean
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  placeholder,
  online,
  className = '',
  ...props
}: AvatarProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'
  const sizeClass = sizeClasses[size]

  return (
    <div className={`avatar ${online !== undefined ? 'online' : ''} ${className}`} {...props}>
      <div className={`${sizeClass} ${shapeClass} bg-base-300 flex items-center justify-center`}>
        {src ? (
          <img src={src} alt={alt} className={`${sizeClass} ${shapeClass} object-cover`} />
        ) : (
          <span className="text-base-content/60 font-medium">
            {placeholder || alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

