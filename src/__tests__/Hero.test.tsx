import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '../components/Hero'

describe('Hero', () => {
  it('renders the name and location', () => {
    render(<Hero />)
    expect(screen.getByText(/S Deepak Achary/)).toBeInTheDocument()
  })

  it('renders the main heading tagline', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('DATA')
    expect(heading.textContent).toContain('STORIES')
    expect(heading.textContent).toContain('SYSTEMS')
  })

  it('renders the subtitle with roles', () => {
    render(<Hero />)
    expect(screen.getByText(/Senior Data Analyst/)).toBeInTheDocument()
    expect(screen.getByText(/AI Architect/)).toBeInTheDocument()
    expect(screen.getByText(/Solopreneur Builder/)).toBeInTheDocument()
  })

  it('renders download resume link', () => {
    render(<Hero />)
    const resumeLink = screen.getByText(/Download Resume/)
    expect(resumeLink).toBeInTheDocument()
    expect(resumeLink.closest('a')).toHaveAttribute('href', '/portfolio/resume.pdf')
  })

  it('renders EST. 2016 badge', () => {
    render(<Hero />)
    expect(screen.getByText('EST. 2016')).toBeInTheDocument()
  })

  it('renders scroll to explore indicator', () => {
    render(<Hero />)
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument()
  })
})
