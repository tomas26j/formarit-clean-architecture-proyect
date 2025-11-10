import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'
import type { SearchParams } from './SearchBar'

describe('SearchBar', () => {
  it('renderiza correctamente', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    expect(screen.getByLabelText(/destino/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument()
  })

  it('llama a onSearch cuando se envía el formulario', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    const destinoInput = screen.getByLabelText(/destino/i)
    await user.type(destinoInput, 'Buenos Aires')

    // Seleccionar fechas (simplificado para el test)
    const checkInInput = screen.getByLabelText(/check-in/i)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await user.type(checkInInput, dateString)

    const checkOutInput = screen.getByLabelText(/check-out/i)
    const inThreeDays = new Date()
    inThreeDays.setDate(inThreeDays.getDate() + 3)
    const checkOutString = inThreeDays.toISOString().split('T')[0]
    await user.type(checkOutInput, checkOutString)

    const submitButton = screen.getByRole('button', { name: /buscar hoteles/i })
    await user.click(submitButton)

    expect(onSearch).toHaveBeenCalled()
  })

  it('deshabilita el botón cuando faltan datos', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const submitButton = screen.getByRole('button', { name: /buscar hoteles/i })
    expect(submitButton).toBeDisabled()
  })

  it('muestra estado de loading', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} loading={true} />)

    const submitButton = screen.getByRole('button', { name: /buscar hoteles/i })
    expect(submitButton).toBeDisabled()
  })
})

