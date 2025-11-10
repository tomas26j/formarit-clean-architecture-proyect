import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Rating } from './Rating'

describe('Rating', () => {
  it('renderiza correctamente', () => {
    render(<Rating value={3} />)
    const inputs = screen.getAllByRole('radio')
    expect(inputs).toHaveLength(5)
  })

  it('muestra el valor cuando showValue es true', () => {
    render(<Rating value={4.5} showValue />)
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument()
  })

  it('llama a onChange cuando se hace click en una estrella editable', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Rating value={3} readonly={false} onChange={handleChange} />)

    const stars = screen.getAllByRole('radio')
    await user.click(stars[4]) // Click en la quinta estrella

    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('no llama a onChange cuando es readonly', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Rating value={3} readonly={true} onChange={handleChange} />)

    const stars = screen.getAllByRole('radio')
    await user.click(stars[4])

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('aplica el tamaño correcto', () => {
    const { container } = render(<Rating value={3} size="sm" />)
    expect(container.querySelector('.rating-sm')).toBeInTheDocument()
  })
})

