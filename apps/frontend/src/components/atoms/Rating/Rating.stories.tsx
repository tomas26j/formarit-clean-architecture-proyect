import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Rating } from './Rating'

const meta: Meta<typeof Rating> = {
  title: 'Atoms/Rating',
  component: Rating,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
    },
    readonly: {
      control: 'boolean',
    },
    showValue: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Rating>

export const ReadOnly: Story = {
  args: {
    value: 4.5,
    readonly: true,
  },
}

export const WithValue: Story = {
  args: {
    value: 4.5,
    readonly: true,
    showValue: true,
  },
}

export const Editable: Story = {
  render: () => {
    const [value, setValue] = useState(3)
    return <Rating value={value} readonly={false} onChange={setValue} />
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Rating value={4} size="sm" showValue />
      <Rating value={4} size="md" showValue />
      <Rating value={4} size="lg" showValue />
    </div>
  ),
}

export const DifferentValues: Story = {
  render: () => (
    <div className="space-y-4">
      <Rating value={1} showValue />
      <Rating value={2.5} showValue />
      <Rating value={3} showValue />
      <Rating value={4.5} showValue />
      <Rating value={5} showValue />
    </div>
  ),
}

export const CustomMax: Story = {
  args: {
    value: 8,
    max: 10,
    showValue: true,
  },
}

