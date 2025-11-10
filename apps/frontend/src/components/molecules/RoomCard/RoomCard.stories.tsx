import type { Meta, StoryObj } from '@storybook/react'
import { RoomCard } from './RoomCard'
import type { Room } from '@/core/models/Room'

const meta: Meta<typeof RoomCard> = {
  title: 'Molecules/RoomCard',
  component: RoomCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RoomCard>

const mockRoom: Room = {
  id: '1',
  hotelId: 'hotel-1',
  tipo: 'Habitación Standard',
  descripcion: 'Habitación cómoda con vista a la ciudad, perfecta para una estadía relajante.',
  capacidad: 2,
  precioPorNoche: 15000,
  imagenUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
  amenidades: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
}

const mockRoomSinImagen: Room = {
  id: '2',
  hotelId: 'hotel-1',
  tipo: 'Habitación Deluxe',
  descripcion: 'Habitación espaciosa con todas las comodidades.',
  capacidad: 4,
  precioPorNoche: 25000,
  amenidades: ['WiFi', 'TV', 'Minibar', 'Jacuzzi'],
}

export const Default: Story = {
  args: {
    room: mockRoom,
    disponible: true,
    onReservar: (id) => console.log('Reservar habitación:', id),
  },
}

export const NoDisponible: Story = {
  args: {
    room: mockRoom,
    disponible: false,
    onReservar: (id) => console.log('Reservar habitación:', id),
  },
}

export const SinImagen: Story = {
  args: {
    room: mockRoomSinImagen,
    disponible: true,
    onReservar: (id) => console.log('Reservar habitación:', id),
  },
}

export const SinAmenidades: Story = {
  args: {
    room: {
      ...mockRoom,
      amenidades: undefined,
    },
    disponible: true,
    onReservar: (id) => console.log('Reservar habitación:', id),
  },
}

export const CapacidadAlta: Story = {
  args: {
    room: {
      ...mockRoom,
      tipo: 'Suite Familiar',
      capacidad: 6,
      precioPorNoche: 35000,
    },
    disponible: true,
    onReservar: (id) => console.log('Reservar habitación:', id),
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RoomCard
        room={mockRoom}
        disponible={true}
        onReservar={(id) => console.log('Habitación:', id)}
      />
      <RoomCard
        room={mockRoomSinImagen}
        disponible={true}
        onReservar={(id) => console.log('Habitación:', id)}
      />
      <RoomCard
        room={{
          ...mockRoom,
          tipo: 'Habitación Premium',
          precioPorNoche: 30000,
        }}
        disponible={false}
        onReservar={(id) => console.log('Habitación:', id)}
      />
    </div>
  ),
}

