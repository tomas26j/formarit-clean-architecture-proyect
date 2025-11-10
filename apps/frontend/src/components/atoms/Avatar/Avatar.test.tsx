import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renderiza correctamente con placeholder', () => {
    render(<Avatar placeholder="JD" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renderiza imagen cuando se proporciona src', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Usuario" />)
    const img = screen.getByAltText('Usuario')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('usa la primera letra del alt cuando no hay placeholder', () => {
    render(<Avatar alt="Juan" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('aplica la clase online cuando online es true', () => {
    const { container } = render(<Avatar online={true} />)
    expect(container.querySelector('.online')).toBeInTheDocument()
  })

  it('aplica el tamaño correcto', () => {
    const { container } = render(<Avatar size="lg" />)
    const avatar = container.querySelector('.w-16')
    expect(avatar).toBeInTheDocument()
  })
})

