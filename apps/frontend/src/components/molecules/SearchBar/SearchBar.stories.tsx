import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from './SearchBar'
import type { SearchParams } from './SearchBar'

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {
    onSearch: (params: SearchParams) => {
      console.log('Búsqueda:', params)
    },
  },
}

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      destino: 'Buenos Aires',
      fechaInicio: new Date('2024-12-01'),
      fechaFin: new Date('2024-12-05'),
      huespedes: { adultos: 2, ninos: 1, bebes: 0 },
    },
    onSearch: (params: SearchParams) => {
      console.log('Búsqueda:', params)
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    onSearch: (params: SearchParams) => {
      console.log('Búsqueda:', params)
    },
  },
}

export const InCard: Story = {
  render: (args) => (
    <div className="card bg-base-200 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Buscar Hoteles</h2>
      <SearchBar {...args} />
    </div>
  ),
  args: {
    onSearch: (params: SearchParams) => {
      console.log('Búsqueda:', params)
    },
  },
}

export const Compact: Story = {
  render: (args) => (
    <div className="max-w-md">
      <SearchBar {...args} />
    </div>
  ),
  args: {
    onSearch: (params: SearchParams) => {
      console.log('Búsqueda:', params)
    },
  },
}

