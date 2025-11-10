import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DatePickerRange } from './DatePickerRange'
import type { DateRange } from './DatePickerRange'

const meta: Meta<typeof DatePickerRange> = {
  title: 'Molecules/DatePickerRange',
  component: DatePickerRange,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DatePickerRange>

const DatePickerRangeWrapper = (args: Omit<Story['args'], 'value' | 'onChange'>) => {
  const [value, setValue] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  })

  return <DatePickerRange value={value} onChange={setValue} {...args} />
}

export const Default: Story = {
  render: () => <DatePickerRangeWrapper />,
}

export const WithMinNights: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({
      checkIn: null,
      checkOut: null,
    })
    return <DatePickerRange value={value} onChange={setValue} minNights={2} />
  },
}

export const WithInitialDates: Story = {
  render: () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const inThreeDays = new Date()
    inThreeDays.setDate(inThreeDays.getDate() + 3)

    const [value, setValue] = useState<DateRange>({
      checkIn: tomorrow,
      checkOut: inThreeDays,
    })
    return <DatePickerRange value={value} onChange={setValue} />
  },
}

export const InCard: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({
      checkIn: null,
      checkOut: null,
    })
    return (
      <div className="card bg-base-200 p-6 max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Seleccione sus fechas</h3>
        <DatePickerRange value={value} onChange={setValue} />
      </div>
    )
  },
}

