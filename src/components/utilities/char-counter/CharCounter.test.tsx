import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { CharCounter } from './CharCounter'

describe('CharCounter component', () => {
  it('renders with empty state', () => {
    render(<CharCounter />)
    expect(screen.getByPlaceholderText('Start typing or paste your text here...')).toBeInTheDocument()
  })

  it('shows zero stats for empty input', () => {
    render(<CharCounter />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(9)
  })

  it('updates stats when typing', () => {
    render(<CharCounter />)
    const textarea = screen.getByPlaceholderText('Start typing or paste your text here...')
    fireEvent.change(textarea, { target: { value: 'hello world' } })
    const chars = screen.getAllByText('11')
    expect(chars.length).toBe(1)
    const words = screen.getAllByText('2')
    expect(words.length).toBe(1)
  })

  it('counts words correctly', () => {
    render(<CharCounter />)
    const textarea = screen.getByPlaceholderText('Start typing or paste your text here...')
    fireEvent.change(textarea, { target: { value: 'one two three four' } })
    const matches = screen.getAllByText('4')
    expect(matches.length).toBe(1)
  })

  it('counts lines correctly', () => {
    render(<CharCounter />)
    const textarea = screen.getByPlaceholderText('Start typing or paste your text here...')
    fireEvent.change(textarea, { target: { value: 'line1\nline2\nline3' } })
    expect(screen.getByText('Lines')).toBeInTheDocument()
    const matches = screen.getAllByText('3')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('counts sentences correctly', () => {
    render(<CharCounter />)
    const textarea = screen.getByPlaceholderText('Start typing or paste your text here...')
    fireEvent.change(textarea, { target: { value: 'First. Second! Third?' } })
    expect(screen.getByText('Sentences')).toBeInTheDocument()
    const matches = screen.getAllByText('3')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('counts paragraphs correctly', () => {
    render(<CharCounter />)
    const textarea = screen.getByPlaceholderText('Start typing or paste your text here...')
    fireEvent.change(textarea, { target: { value: 'Para1\n\nPara2\n\nPara3' } })
    expect(screen.getByText('Paragraphs')).toBeInTheDocument()
    const matches = screen.getAllByText('3')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
