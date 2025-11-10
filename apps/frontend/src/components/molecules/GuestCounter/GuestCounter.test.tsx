import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuestCounter } from './GuestCounter'
import type { GuestCount } from './GuestCounter'

describe('GuestCounter', () => {
  it('renderiza correctamente', () => {
    const value: GuestCount = { adultos: 2, ninos: 0, bebes: 0 }
    const onChange = vi.fn()
    render(<GuestCounter value={value} onChange={onChange} />)

    expect(screen.getByText('Adultos')).toBeInTheDocument()
    expect(screen.getByText('Niños')).toBeInTheDocument()
    expect(screen.getByText('Bebés')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Adultos
  })

  it('muestra el total de huéspedes', () => {
    const value: GuestCount = { adultos: 2, ninos: 1, bebes: 1 }
    const onChange = vi.fn()
    render(<GuestCounter value={value} onChange={onChange} />)

    expect(screen.getByText('4')).toBeInTheDocument() // Total
  })

  it('incrementa adultos cuando se hace click en +', async () => {
    const value: GuestCount = { adultos: 2, ninos: 0, bebes: 0 }
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<GuestCounter value={value} onChange={onChange} />)

    const buttons = screen.getAllByText('+')
    await user.click(buttons[0]) // Primer botón es de adultos

    expect(onChange).toHaveBeenCalledWith({ adultos: 3, ninos: 0, bebes: 0 })
  })

  it('decrementa adultos cuando se hace click en -', async () => {
    const value: GuestCount = { adultos: 2, ninos: 0, bebes: 0 }
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<GuestCounter value={value} onChange={onChange} minAdults={1} />)

    const buttons = screen.getAllByText('−')
    await user.click(buttons[0]) // Primer botón es de adultos

    expect(onChange).toHaveBeenCalledWith({ adultos: 1, ninos: 0, bebes: 0 })
  })

  it('no permite decrementar adultos por debajo del mínimo', async () => {
    const value: GuestCount = { adultos: 1, ninos: 0, bebes: 0 }
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<GuestCounter value={value} onChange={onChange} minAdults={1} />)

    const buttons = screen.getAllByText('−')
    const adultosButton = buttons[0]
    expect(adultosButton).toBeDisabled()
  })

  it('no permite incrementar por encima del máximo', async () => {
    const value: GuestCount = { adultos: 10, ninos: 0, bebes: 0 }
    const onChange = vi.fn()
    render(<GuestCounter value={value} onChange={onChange} maxAdults={10} />)

    const buttons = screen.getAllByText('+')
    const adultosButton = buttons[0]
    expect(adultosButton).toBeDisabled()
  })
})

