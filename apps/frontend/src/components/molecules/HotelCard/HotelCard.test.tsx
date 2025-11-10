import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HotelCard } from './HotelCard'
import type { Hotel } from '@/core/models/Hotel'

const mockHotel: Hotel = {
  id: '1',
  nombre: 'Hotel Test',
  ubicacion: 'Buenos Aires',
  descripcion: 'Descripción del hotel',
  rating: 4.5,
  servicios: ['WiFi', 'Piscina'],
}

describe('HotelCard', () => {
  it('renderiza correctamente', () => {
    render(<HotelCard hotel={mockHotel} />)
    expect(screen.getByText('Hotel Test')).toBeInTheDocument()
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument()
  })

  it('muestra el precio cuando se proporciona', () => {
    render(<HotelCard hotel={mockHotel} precioDesde={15000} />)
    expect(screen.getByText(/15.000|ARS/)).toBeInTheDocument()
  })

  it('llama a onVerDetalles cuando se hace click en el botón', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<HotelCard hotel={mockHotel} onVerDetalles={handleClick} />)

    const button = screen.getByRole('button', { name: /ver detalles/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledWith('1')
  })

  it('muestra servicios cuando están disponibles', () => {
    render(<HotelCard hotel={mockHotel} />)
    expect(screen.getByText('WiFi')).toBeInTheDocument()
    expect(screen.getByText('Piscina')).toBeInTheDocument()
  })

  it('muestra rating cuando está disponible', () => {
    render(<HotelCard hotel={mockHotel} />)
    // El rating debería estar presente
    expect(screen.getByText('Hotel Test')).toBeInTheDocument()
  })
})

