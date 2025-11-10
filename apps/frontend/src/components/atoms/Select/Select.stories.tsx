import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import type { SelectOption } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const defaultOptions: SelectOption[] = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
]

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Seleccione una opción',
    options: defaultOptions,
  },
}

export const WithPlaceholder: Story = {
  args: {
    label: 'Tipo de habitación',
    placeholder: 'Seleccione un tipo',
    options: [
      { value: 'single', label: 'Habitación Individual' },
      { value: 'double', label: 'Habitación Doble' },
      { value: 'suite', label: 'Suite' },
      { value: 'family', label: 'Habitación Familiar' },
    ],
  },
}

export const Required: Story = {
  args: {
    label: 'Ciudad',
    required: true,
    placeholder: 'Seleccione una ciudad',
    options: [
      { value: 'bsas', label: 'Buenos Aires' },
      { value: 'cba', label: 'Córdoba' },
      { value: 'mza', label: 'Mendoza' },
      { value: 'ros', label: 'Rosario' },
    ],
  },
}

export const WithError: Story = {
  args: {
    label: 'Ciudad',
    error: 'Debe seleccionar una ciudad',
    options: defaultOptions,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Método de pago',
    helperText: 'Seleccione su método de pago preferido',
    options: [
      { value: 'credit', label: 'Tarjeta de Crédito' },
      { value: 'debit', label: 'Tarjeta de Débito' },
      { value: 'transfer', label: 'Transferencia Bancaria' },
    ],
  },
}

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    disabled: true,
    options: defaultOptions,
    defaultValue: '1',
  },
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Habitación',
    options: [
      { value: '1', label: 'Habitación 101 - Disponible' },
      { value: '2', label: 'Habitación 102 - Disponible' },
      { value: '3', label: 'Habitación 103 - Ocupada', disabled: true },
      { value: '4', label: 'Habitación 104 - Disponible' },
    ],
  },
}

export const FullWidth: Story = {
  args: {
    label: 'Campo de ancho completo',
    fullWidth: true,
    options: defaultOptions,
  },
}

