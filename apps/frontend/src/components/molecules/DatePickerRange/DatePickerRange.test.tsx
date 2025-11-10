import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePickerRange } from './DatePickerRange'
import type { DateRange } from './DatePickerRange'

describe('DatePickerRange', () => {
  it('renderiza correctamente', () => {
    const value: DateRange = { checkIn: null, checkOut: null }
    const onChange = vi.fn()
    render(<DatePickerRange value={value} onChange={onChange} />)

    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument()
  })

  it('llama a onChange cuando se selecciona check-in', async () => {
    const value: DateRange = { checkIn: null, checkOut: null }
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<DatePickerRange value={value} onChange={onChange} />)

    const checkInInput = screen.getByLabelText(/check-in/i)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]

    await user.type(checkInInput, dateString)

    expect(onChange).toHaveBeenCalled()
  })

  it('resetea check-out si es anterior a check-in', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const value: DateRange = { checkIn: null, checkOut: yesterday }
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<DatePickerRange value={value} onChange={onChange} />)

    const checkInInput = screen.getByLabelText(/check-in/i)
    const dateString = tomorrow.toISOString().split('T')[0]

    await user.type(checkInInput, dateString)

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
    expect(lastCall[0].checkOut).toBeNull()
  })
})

