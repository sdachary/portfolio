import { describe, it, expect, vi } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  it('is hidden by default (no #about element)', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })

  it('appears when #about is within viewport', async () => {
    const about = document.createElement('div')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: 100, bottom: 200, height: 100, left: 0, right: 100, width: 100, x: 0, y: 0 })
    document.body.appendChild(about)

    render(<Navbar />)

    act(() => { window.dispatchEvent(new Event('scroll')) })

    await waitFor(() => {
      expect(screen.getByText('SDA ✦ Portfolio')).toBeInTheDocument()
    })

    document.body.removeChild(about)
  })

  it('stays hidden when #about is far below viewport', async () => {
    const about = document.createElement('div')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: 2000, bottom: 2100, height: 100, left: 0, right: 100, width: 100, x: 0, y: 0 })
    document.body.appendChild(about)

    render(<Navbar />)

    act(() => { window.dispatchEvent(new Event('scroll')) })

    await waitFor(() => {
      expect(screen.queryByText('SDA ✦ Portfolio')).not.toBeInTheDocument()
    })

    document.body.removeChild(about)
  })

  it('renders all navigation links when visible', async () => {
    const about = document.createElement('div')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: 100, bottom: 200, height: 100, left: 0, right: 100, width: 100, x: 0, y: 0 })
    document.body.appendChild(about)

    render(<Navbar />)

    act(() => { window.dispatchEvent(new Event('scroll')) })

    await waitFor(() => {
      expect(screen.getByText('Origin')).toBeInTheDocument()
    })
    expect(screen.getByText('Identity')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Stack')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Work With Me')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()

    document.body.removeChild(about)
  })
})
