import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { URLEncoder } from './URLEncoder'

describe('URLEncoder component', () => {
  it('renders input area and action buttons', () => {
    render(<URLEncoder />)
    expect(screen.getByPlaceholderText('Enter text or URL...')).toBeInTheDocument()
    expect(screen.getByText('🔒 Encode Component')).toBeInTheDocument()
    expect(screen.getByText('🔓 Decode Component')).toBeInTheDocument()
  })

  it('encodes URI components correctly', () => {
    render(<URLEncoder />)
    const input = screen.getByPlaceholderText('Enter text or URL...')
    fireEvent.change(input, { target: { value: 'hello world & friends?' } })
    fireEvent.click(screen.getByText('🔒 Encode Component'))

    const outputs = screen.getAllByRole('textbox')
    expect(outputs[1]).toHaveValue('hello%20world%20%26%20friends%3F')
  })

  it('decodes URI components correctly', () => {
    render(<URLEncoder />)
    const input = screen.getByPlaceholderText('Enter text or URL...')
    fireEvent.change(input, { target: { value: 'hello%20world%20%26%20friends%3F' } })
    fireEvent.click(screen.getByText('🔓 Decode Component'))

    const outputs = screen.getAllByRole('textbox')
    expect(outputs[1]).toHaveValue('hello world & friends?')
  })
})
