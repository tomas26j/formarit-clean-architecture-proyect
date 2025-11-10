import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RoomCard } from './RoomCard'
import type { Room } from '@/core/models/Room'

const mockRoom: Room = {
  id: '1',
  hotelId: 'hotel-1',
  tipo: 'Habitación Test',
  capacidad: 2,
  precioPorNoche: 15000,
  amenidades: ['WiFi', 'TV'],
}

describe('RoomCard', () => {
  it('renderiza correctamente', () => {
    render(<RoomCard room={mockRoom} />)
    expect(screen.getByText('Habitación Test')).toBeInTheDocument()
    expect(screen.getByText(/2 huéspedes/)).toBeInTheDocument()
  })

  it('muestra el precio correctamente', () => {
    render(<RoomCard room={mockRoom} />)
    expect(screen.getByText(/15.000|ARS/)).toBeInTheDocument()
  })

  it('llama a onReservar cuando se hace click en el botón', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<RoomCard room={mockRoom} onReservar={handleClick} />)

    const button = screen.getByRole('button', { name: /reservar/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledWith('1')
  })

  it('muestra "No disponible" cuando disponible es false', () => {
    render(<RoomCard room={mockRoom} disponible={false} />)
    expect(screen.getByText('No disponible')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('muestra amenidades cuando están disponibles', () => {
    render(<RoomCard room={mockRoom} />)
    expect(screen.getByText('WiFi')).toBeInTheDocument()
    expect(screen.getByText('TV')).toBeInTheDocument()
  })
})

