import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Espaciado',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

const SpacingBox = ({ size, value }: { size: string; value: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-24 text-sm font-mono">{size}</div>
    <div className="flex items-center gap-2">
      <div className="bg-primary" style={{ width: value, height: value }} />
      <span className="text-sm text-base-content/60">{value}</span>
    </div>
  </div>
)

export const EscalaDeEspaciado: Story = {
  render: () => (
    <div className="space-y-4">
      <SpacingBox size="xs (0.5rem)" value="8px" />
      <SpacingBox size="sm (1rem)" value="16px" />
      <SpacingBox size="md (1.5rem)" value="24px" />
      <SpacingBox size="lg (2rem)" value="32px" />
      <SpacingBox size="xl (3rem)" value="48px" />
      <SpacingBox size="2xl (4rem)" value="64px" />
    </div>
  ),
}

export const EjemplosDeUso: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Padding en tarjetas</h3>
        <div className="card bg-base-200 p-4">
          <p>p-4 (1rem / 16px)</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Padding generoso</h3>
        <div className="card bg-base-200 p-6">
          <p>p-6 (1.5rem / 24px)</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Gap entre elementos</h3>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary rounded"></div>
          <div className="w-16 h-16 bg-primary rounded"></div>
          <div className="w-16 h-16 bg-primary rounded"></div>
        </div>
        <p className="text-sm text-base-content/60 mt-2">gap-4 (1rem / 16px)</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Espaciado vertical</h3>
        <div className="space-y-4">
          <div className="w-full h-12 bg-primary rounded"></div>
          <div className="w-full h-12 bg-primary rounded"></div>
          <div className="w-full h-12 bg-primary rounded"></div>
        </div>
        <p className="text-sm text-base-content/60 mt-2">space-y-4 (1rem / 16px)</p>
      </div>
    </div>
  ),
}

