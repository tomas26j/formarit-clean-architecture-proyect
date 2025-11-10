import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Colores',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

const ColorSwatch = ({ name, color, description }: { name: string; color: string; description?: string }) => (
  <div className="flex flex-col gap-2">
    <div
      className="w-full h-24 rounded-lg shadow-md border border-base-300"
      style={{ backgroundColor: color }}
    />
    <div>
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs text-base-content/60 font-mono">{color}</div>
      {description && <div className="text-xs text-base-content/70 mt-1">{description}</div>}
    </div>
  </div>
)

export const PaletaCompleta: Story = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Colores Primarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSwatch
            name="Primary"
            color="#C0A888"
            description="Arena cálida - acentos principales"
          />
          <ColorSwatch
            name="Primary Focus"
            color="#A8926F"
            description="Hover/estados activos"
          />
          <ColorSwatch
            name="Primary Content"
            color="#FFFFFF"
            description="Texto sobre primary"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Colores Neutros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ColorSwatch name="Base 100" color="#FFFFFF" description="Fondo principal" />
          <ColorSwatch name="Base 200" color="#F5F5F5" description="Fondos secundarios" />
          <ColorSwatch name="Base 300" color="#E5E5E5" description="Bordes sutiles" />
          <ColorSwatch name="Base Content" color="#1F2937" description="Texto principal" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Colores de Acento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSwatch name="Accent" color="#1E3A5F" description="Azul profundo - CTAs importantes" />
          <ColorSwatch name="Accent Focus" color="#152A47" description="Hover de accent" />
          <ColorSwatch name="Accent Content" color="#FFFFFF" description="Texto sobre accent" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Estados Semánticos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ColorSwatch name="Success" color="#10B981" description="Confirmaciones" />
          <ColorSwatch name="Warning" color="#F59E0B" description="Advertencias" />
          <ColorSwatch name="Error" color="#EF4444" description="Errores" />
          <ColorSwatch name="Info" color="#3B82F6" description="Información" />
        </div>
      </section>
    </div>
  ),
}

export const UsoEnComponentes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Botones</h3>
        <div className="flex gap-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Badges</h3>
        <div className="flex gap-2">
          <span className="badge badge-primary">Primary</span>
          <span className="badge badge-success">Success</span>
          <span className="badge badge-warning">Warning</span>
          <span className="badge badge-error">Error</span>
          <span className="badge badge-info">Info</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Alertas</h3>
        <div className="space-y-2">
          <div className="alert alert-success">
            <span>Operación exitosa</span>
          </div>
          <div className="alert alert-warning">
            <span>Advertencia importante</span>
          </div>
          <div className="alert alert-error">
            <span>Error en la operación</span>
          </div>
          <div className="alert alert-info">
            <span>Información relevante</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

