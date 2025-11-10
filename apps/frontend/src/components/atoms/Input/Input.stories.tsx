import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'number', 'date', 'password', 'tel'],
    },
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
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Ingrese su texto aquí',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej: Juan Pérez',
  },
}

export const Required: Story = {
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'usuario@ejemplo.com',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: 'El email ingresado no es válido',
    defaultValue: 'email-invalido',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Teléfono',
    type: 'tel',
    helperText: 'Incluya código de área',
    placeholder: '+54 11 1234-5678',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    disabled: true,
    defaultValue: 'Valor no editable',
  },
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input label="Texto" type="text" placeholder="Texto" />
      <Input label="Email" type="email" placeholder="email@ejemplo.com" />
      <Input label="Número" type="number" placeholder="123" />
      <Input label="Fecha" type="date" />
      <Input label="Contraseña" type="password" placeholder="••••••••" />
      <Input label="Teléfono" type="tel" placeholder="+54 11 1234-5678" />
    </div>
  ),
}

export const FullWidth: Story = {
  args: {
    label: 'Campo de ancho completo',
    fullWidth: true,
    placeholder: 'Este campo ocupa todo el ancho disponible',
  },
}

