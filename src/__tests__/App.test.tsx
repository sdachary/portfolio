import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import App from '../App'

vi.mock('../components/Preloader', () => ({
  default: ({ children }) => <>{children}</>,
}))

describe('App', () => {
  beforeEach(() => {
    const about = document.createElement('div')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: 100, bottom: 200, height: 100, left: 0, right: 100, width: 100, x: 0, y: 0 })
    document.body.appendChild(about)

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([
        { name: 'Test Project', description: 'A test', slug: 'test', status: 'Live', status_key: 'live', tags: ['React'] },
      ]),
    })
  })

  it('renders Hero section with name', () => {
    render(<App />)
    const matches = screen.getAllByText(/S Deepak Achary/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders About section with 9-year stat', () => {
    render(<App />)
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('Years of Impact')).toBeInTheDocument()
  })

  it('renders Contact section with form', () => {
    render(<App />)
    expect(screen.getByText("Let's Connect")).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
  })

  it('renders Projects section heading', async () => {
    render(<App />)
    const heading = await screen.findByText('PROJECTS')
    expect(heading).toBeInTheDocument()
  })

  it('renders project card from fetched data', async () => {
    render(<App />)
    const project = await screen.findByText('Test Project')
    expect(project).toBeInTheDocument()
  })
})
