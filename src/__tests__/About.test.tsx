import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from '../components/About'

describe('About', () => {
  it('renders the section with id "about"', () => {
    const { container } = render(<About />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })

  it('renders the large "9" number', () => {
    render(<About />)
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('renders "Years of Impact" label', () => {
    render(<About />)
    expect(screen.getByText('Years of Impact')).toBeInTheDocument()
  })

  it('renders "Origin Story" heading', () => {
    render(<About />)
    expect(screen.getByText('Origin Story')).toBeInTheDocument()
  })

  it('renders all four story paragraphs', () => {
    render(<About />)
    expect(screen.getByText(/HR professional/)).toBeInTheDocument()
    expect(screen.getByText(/raw, messy data/)).toBeInTheDocument()
    expect(screen.getByText(/entire ecosystem from scratch/)).toBeInTheDocument()
    expect(screen.getByText(/sovereign, India-resident infrastructure/)).toBeInTheDocument()
  })
})
