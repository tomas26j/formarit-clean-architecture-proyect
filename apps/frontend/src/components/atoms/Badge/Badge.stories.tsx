import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Disponible',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Confirmado',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pendiente',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Cancelado',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Nuevo',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Destacado',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Badge size="sm">Pequeño</Badge>
      <Badge size="md">Mediano</Badge>
      <Badge size="lg">Grande</Badge>
    </div>
  ),
}

export const HotelStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Disponible</Badge>
      <Badge variant="warning">Ocupado</Badge>
      <Badge variant="error">No disponible</Badge>
      <Badge variant="info">Destacado</Badge>
      <Badge variant="outline">Próximamente</Badge>
    </div>
  ),
}

