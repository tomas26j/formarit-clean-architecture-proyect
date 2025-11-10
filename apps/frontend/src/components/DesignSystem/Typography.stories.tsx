import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Tipografía',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

export const EscalaDeTamaños: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Heading 1 - 4xl (36px)</h1>
        <p className="text-sm text-base-content/60">Títulos principales de página</p>
      </div>
      <div>
        <h2 className="text-3xl font-bold">Heading 2 - 3xl (30px)</h2>
        <p className="text-sm text-base-content/60">Títulos de sección</p>
      </div>
      <div>
        <h3 className="text-2xl font-semibold">Heading 3 - 2xl (24px)</h3>
        <p className="text-sm text-base-content/60">Subtítulos</p>
      </div>
      <div>
        <h4 className="text-xl font-semibold">Heading 4 - xl (20px)</h4>
        <p className="text-sm text-base-content/60">Títulos de componente</p>
      </div>
      <div>
        <p className="text-base">Body - base (16px)</p>
        <p className="text-sm text-base-content/60">Texto principal del cuerpo</p>
      </div>
      <div>
        <p className="text-sm">Small - sm (14px)</p>
        <p className="text-sm text-base-content/60">Texto secundario, labels</p>
      </div>
      <div>
        <p className="text-xs">Extra Small - xs (12px)</p>
        <p className="text-sm text-base-content/60">Texto muy pequeño, hints</p>
      </div>
    </div>
  ),
}

export const Pesos: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="font-normal">Regular (400) - Texto normal</p>
      <p className="font-medium">Medium (500) - Texto medio</p>
      <p className="font-semibold">Semibold (600) - Texto seminegrita</p>
      <p className="font-bold">Bold (700) - Texto negrita</p>
    </div>
  ),
}

export const EjemploDeTexto: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl font-bold">Hotel Reservation System</h1>
      <h2 className="text-2xl font-semibold">Bienvenido a nuestro sistema de reservas</h2>
      <p className="text-base">
        Nuestro sistema le permite buscar y reservar hoteles de manera fácil y rápida. Explore
        nuestras opciones disponibles y encuentre el alojamiento perfecto para su próximo viaje.
      </p>
      <p className="text-sm text-base-content/70">
        Todos los precios incluyen impuestos. Las reservas pueden cancelarse hasta 24 horas antes
        del check-in.
      </p>
    </div>
  ),
}

