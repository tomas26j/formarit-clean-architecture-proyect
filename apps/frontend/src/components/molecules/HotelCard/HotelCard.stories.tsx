import type { Meta, StoryObj } from '@storybook/react'
import { HotelCard } from './HotelCard'
import type { Hotel } from '@/core/models/Hotel'

const meta: Meta<typeof HotelCard> = {
  title: 'Molecules/HotelCard',
  component: HotelCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HotelCard>

const mockHotel: Hotel = {
  id: '1',
  nombre: 'Hotel Grand Plaza',
  ubicacion: 'Buenos Aires, Argentina',
  descripcion: 'Hotel de lujo en el corazón de la ciudad con todas las comodidades modernas.',
  rating: 4.5,
  imagenUrl: 'https://images.unsplash.com/photo-1566073771259-6a0d9f5c0e0e?w=800',
  servicios: ['WiFi', 'Piscina', 'Spa', 'Gimnasio', 'Restaurante'],
}

const mockHotelSinImagen: Hotel = {
  id: '2',
  nombre: 'Hotel Simple',
  ubicacion: 'Córdoba, Argentina',
  descripcion: 'Hotel acogedor y económico para una estadía cómoda.',
  rating: 3.8,
  servicios: ['WiFi', 'Desayuno'],
}

export const Default: Story = {
  args: {
    hotel: mockHotel,
    precioDesde: 15000,
    onVerDetalles: (id) => console.log('Ver detalles de hotel:', id),
  },
}

export const SinPrecio: Story = {
  args: {
    hotel: mockHotel,
    onVerDetalles: (id) => console.log('Ver detalles de hotel:', id),
  },
}

export const SinImagen: Story = {
  args: {
    hotel: mockHotelSinImagen,
    precioDesde: 8000,
    onVerDetalles: (id) => console.log('Ver detalles de hotel:', id),
  },
}

export const SinRating: Story = {
  args: {
    hotel: {
      ...mockHotel,
      rating: undefined,
    },
    precioDesde: 12000,
    onVerDetalles: (id) => console.log('Ver detalles de hotel:', id),
  },
}

export const MuchosServicios: Story = {
  args: {
    hotel: {
      ...mockHotel,
      servicios: ['WiFi', 'Piscina', 'Spa', 'Gimnasio', 'Restaurante', 'Bar', 'Room Service'],
    },
    precioDesde: 20000,
    onVerDetalles: (id) => console.log('Ver detalles de hotel:', id),
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <HotelCard
        hotel={mockHotel}
        precioDesde={15000}
        onVerDetalles={(id) => console.log('Hotel:', id)}
      />
      <HotelCard
        hotel={mockHotelSinImagen}
        precioDesde={8000}
        onVerDetalles={(id) => console.log('Hotel:', id)}
      />
      <HotelCard
        hotel={{
          ...mockHotel,
          nombre: 'Hotel Premium',
          precioDesde: 25000,
        }}
        precioDesde={25000}
        onVerDetalles={(id) => console.log('Hotel:', id)}
      />
    </div>
  ),
}

