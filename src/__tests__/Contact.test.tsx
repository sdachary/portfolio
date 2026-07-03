import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from '../components/Contact'

describe('Contact', () => {
  it('renders the section with id "contact"', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })

  it('renders "Let\'s Connect" heading', () => {
    render(<Contact />)
    expect(screen.getByText("Let's Connect")).toBeInTheDocument()
  })

  it('renders the main CTA heading', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { level: 2, name: /READY/ })).toBeInTheDocument()
  })

  it('renders all contact links', () => {
    render(<Contact />)
    expect(screen.getByText(/deepakachary246@gmail.com/)).toBeInTheDocument()
    expect(screen.getByText(/LinkedIn/)).toBeInTheDocument()
    expect(screen.getByText(/Twitter\/X/)).toBeInTheDocument()
    expect(screen.getByText(/GitHub/)).toBeInTheDocument()
  })

  it('renders the contact form with all fields', () => {
    render(<Contact />)
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Tell me about/)).toBeInTheDocument()
    expect(screen.getByText(/send a message/i)).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<Contact />)
    expect(screen.getByText(/Send Message/)).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    const year = new Date().getFullYear()
    render(<Contact />)
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    expect(screen.getByText(/S Deepak Achary/)).toBeInTheDocument()
  })

  it('renders location footer', () => {
    render(<Contact />)
    expect(screen.getByText(/Hyderabad, India/)).toBeInTheDocument()
  })
})
