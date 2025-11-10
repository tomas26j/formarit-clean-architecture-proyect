import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Select } from './Select'

const options = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
]

describe('Select', () => {
  it('renderiza correctamente', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('muestra el label cuando se proporciona', () => {
    render(<Select label="Ciudad" options={options} />)
    expect(screen.getByText('Ciudad')).toBeInTheDocument()
  })

  it('renderiza todas las opciones', () => {
    render(<Select options={options} />)
    expect(screen.getByText('Opción 1')).toBeInTheDocument()
    expect(screen.getByText('Opción 2')).toBeInTheDocument()
    expect(screen.getByText('Opción 3')).toBeInTheDocument()
  })

  it('muestra el error cuando se proporciona', () => {
    render(<Select label="Ciudad" error="Debe seleccionar una opción" options={options} />)
    expect(screen.getByText('Debe seleccionar una opción')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveClass('select-error')
  })

  it('muestra el placeholder cuando se proporciona', () => {
    render(<Select placeholder="Seleccione..." options={options} />)
    const placeholderOption = screen.getByText('Seleccione...')
    expect(placeholderOption).toBeInTheDocument()
    expect(placeholderOption).toBeDisabled()
  })

  it('deshabilita opciones marcadas como disabled', () => {
    const optionsWithDisabled = [
      { value: '1', label: 'Disponible' },
      { value: '2', label: 'No disponible', disabled: true },
    ]
    render(<Select options={optionsWithDisabled} />)
    const select = screen.getByRole('combobox')
    const option = select.querySelector('option[value="2"]')
    expect(option).toBeDisabled()
  })
})

