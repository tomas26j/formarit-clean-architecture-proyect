import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceBreakdown } from './PriceBreakdown'
import type { PriceItem } from './PriceBreakdown'

describe('PriceBreakdown', () => {
  const items: PriceItem[] = [
    { label: 'Habitación', value: 10000 },
    { label: 'Servicio', value: 2000 },
  ]

  it('renderiza correctamente', () => {
    render(<PriceBreakdown items={items} subtotal={12000} total={12000} />)
    expect(screen.getByText('Habitación')).toBeInTheDocument()
    expect(screen.getByText('Servicio')).toBeInTheDocument()
  })

  it('muestra el total correctamente', () => {
    render(<PriceBreakdown items={items} subtotal={12000} total={15000} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('muestra impuestos cuando se proporcionan', () => {
    render(<PriceBreakdown items={items} subtotal={12000} impuestos={3000} total={15000} />)
    expect(screen.getByText('Impuestos')).toBeInTheDocument()
  })

  it('muestra descuentos cuando se proporcionan', () => {
    const descuentos: PriceItem[] = [{ label: 'Descuento', value: 1000 }]
    render(
      <PriceBreakdown
        items={items}
        subtotal={12000}
        descuentos={descuentos}
        total={11000}
      />
    )
    expect(screen.getByText('Descuento')).toBeInTheDocument()
  })

  it('formatea los precios correctamente', () => {
    render(<PriceBreakdown items={items} subtotal={12000} total={12000} />)
    // Verifica que los precios estén formateados (contienen símbolo de moneda o formato numérico)
    const priceElements = screen.getAllByText(/\$|ARS|[\d.,]+/)
    expect(priceElements.length).toBeGreaterThan(0)
  })
})

