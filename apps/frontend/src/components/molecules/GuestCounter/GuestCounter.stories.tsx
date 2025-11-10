import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { GuestCounter } from './GuestCounter'
import type { GuestCount } from './GuestCounter'

const meta: Meta<typeof GuestCounter> = {
  title: 'Molecules/GuestCounter',
  component: GuestCounter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GuestCounter>

const GuestCounterWrapper = (args: Omit<Story['args'], 'value' | 'onChange'>) => {
  const [value, setValue] = useState<GuestCount>({ adultos: 2, ninos: 0, bebes: 0 })

  return <GuestCounter value={value} onChange={setValue} {...args} />
}

export const Default: Story = {
  render: () => <GuestCounterWrapper />,
}

export const WithInitialValues: Story = {
  render: () => {
    const [value, setValue] = useState<GuestCount>({ adultos: 2, ninos: 1, bebes: 1 })
    return <GuestCounter value={value} onChange={setValue} />
  },
}

export const WithLimits: Story = {
  render: () => {
    const [value, setValue] = useState<GuestCount>({ adultos: 1, ninos: 0, bebes: 0 })
    return (
      <GuestCounter
        value={value}
        onChange={setValue}
        minAdults={1}
        maxAdults={4}
        maxNinos={2}
        maxBebes={1}
      />
    )
  },
}

export const MaximumGuests: Story = {
  render: () => {
    const [value, setValue] = useState<GuestCount>({ adultos: 10, ninos: 5, bebes: 2 })
    return <GuestCounter value={value} onChange={setValue} />
  },
}

