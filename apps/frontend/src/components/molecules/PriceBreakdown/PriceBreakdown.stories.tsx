import type { Meta, StoryObj } from '@storybook/react'
import { PriceBreakdown } from './PriceBreakdown'
import type { PriceItem } from './PriceBreakdown'

const meta: Meta<typeof PriceBreakdown> = {
  title: 'Molecules/PriceBreakdown',
  component: PriceBreakdown,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PriceBreakdown>

const defaultItems: PriceItem[] = [
  { label: 'Habitación Standard', value: 15000, description: '3 noches' },
  { label: 'Servicio de limpieza', value: 2000 },
]

export const Default: Story = {
  args: {
    items: defaultItems,
    subtotal: 17000,
    impuestos: 3570,
    total: 20570,
  },
}

export const WithDiscounts: Story = {
  args: {
    items: defaultItems,
    subtotal: 17000,
    descuentos: [{ label: 'Descuento por estadía prolongada', value: 2000 }],
    impuestos: 3150,
    total: 18150,
  },
}

export const Simple: Story = {
  args: {
    items: [{ label: 'Habitación Deluxe', value: 25000, description: '2 noches' }],
    subtotal: 25000,
    impuestos: 5250,
    total: 30250,
  },
}

export const MultipleItems: Story = {
  args: {
    items: [
      { label: 'Habitación Standard', value: 15000, description: '3 noches' },
      { label: 'Servicio de limpieza', value: 2000 },
      { label: 'Desayuno incluido', value: 4500, description: '2 personas' },
      { label: 'Estacionamiento', value: 1500, description: '3 días' },
    ],
    subtotal: 23000,
    impuestos: 4830,
    total: 27830,
  },
}

export const WithoutTaxes: Story = {
  args: {
    items: defaultItems,
    subtotal: 17000,
    impuestos: 0,
    total: 17000,
  },
}

export const InCard: Story = {
  render: (args) => (
    <div className="card bg-base-200 p-6 max-w-md">
      <h3 className="text-xl font-semibold mb-4">Resumen de Precios</h3>
      <PriceBreakdown {...args} />
    </div>
  ),
  args: {
    items: defaultItems,
    subtotal: 17000,
    descuentos: [{ label: 'Descuento por estadía prolongada', value: 2000 }],
    impuestos: 3150,
    total: 18150,
  },
}

