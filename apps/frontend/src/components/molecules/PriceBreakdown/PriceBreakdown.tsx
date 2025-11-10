export interface PriceItem {
  label: string
  value: number
  description?: string
}

export interface PriceBreakdownProps {
  items: PriceItem[]
  subtotal: number
  impuestos?: number
  descuentos?: PriceItem[]
  total: number
  currency?: string
  className?: string
}

export function PriceBreakdown({
  items,
  subtotal,
  impuestos = 0,
  descuentos = [],
  total,
  currency = 'ARS',
  className = '',
}: PriceBreakdownProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const subtotalConDescuentos = subtotal - descuentos.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div>
                <span className="text-base-content">{item.label}</span>
                {item.description && (
                  <p className="text-xs text-base-content/60">{item.description}</p>
                )}
              </div>
              <span className="font-medium">{formatPrice(item.value)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Descuentos */}
      {descuentos.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-base-300">
          {descuentos.map((descuento, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-success">{descuento.label}</span>
              <span className="font-medium text-success">-{formatPrice(descuento.value)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal */}
      <div className="flex justify-between pt-2 border-t border-base-300">
        <span className="font-medium">Subtotal</span>
        <span className="font-medium">{formatPrice(subtotalConDescuentos)}</span>
      </div>

      {/* Impuestos */}
      {impuestos > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-base-content/70">Impuestos</span>
          <span>{formatPrice(impuestos)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between pt-3 border-t-2 border-primary font-bold text-lg">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  )
}

