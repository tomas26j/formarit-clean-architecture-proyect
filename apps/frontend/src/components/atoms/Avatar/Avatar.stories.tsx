import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    online: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    placeholder: 'JD',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'Usuario',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs" placeholder="XS" />
      <Avatar size="sm" placeholder="SM" />
      <Avatar size="md" placeholder="MD" />
      <Avatar size="lg" placeholder="LG" />
      <Avatar size="xl" placeholder="XL" />
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar shape="circle" placeholder="C" />
      <Avatar shape="square" placeholder="S" />
    </div>
  ),
}

export const Online: Story = {
  args: {
    placeholder: 'JD',
    online: true,
  },
}

export const Offline: Story = {
  args: {
    placeholder: 'JD',
    online: false,
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Juan Pérez',
  },
}

