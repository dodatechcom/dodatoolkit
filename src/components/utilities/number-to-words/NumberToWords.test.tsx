import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { NumberToWords, numberToWords, convertHundreds } from './NumberToWords'

describe('convertHundreds', () => {
  it('converts 0 to zero', () => {
    expect(convertHundreds(0)).toBe('zero')
  })

  it('converts 1 to one', () => {
    expect(convertHundreds(1)).toBe('one')
  })

  it('converts 10 to ten', () => {
    expect(convertHundreds(10)).toBe('ten')
  })

  it('converts 15 to fifteen', () => {
    expect(convertHundreds(15)).toBe('fifteen')
  })

  it('converts 20 to twenty', () => {
    expect(convertHundreds(20)).toBe('twenty')
  })

  it('converts 21 to twenty one', () => {
    expect(convertHundreds(21)).toBe('twenty one')
  })

  it('converts 100 to one hundred', () => {
    expect(convertHundreds(100)).toBe('one hundred')
  })

  it('converts 115 to one hundred fifteen', () => {
    expect(convertHundreds(115)).toBe('one hundred fifteen')
  })

  it('converts 999 to nine hundred ninety nine', () => {
    expect(convertHundreds(999)).toBe('nine hundred ninety nine')
  })
})

describe('numberToWords', () => {
  it('converts 0 to zero', () => {
    expect(numberToWords(0)).toBe('zero')
  })

  it('converts negative numbers', () => {
    expect(numberToWords(-42)).toBe('minus forty two')
  })

  it('converts 1000 to one thousand', () => {
    expect(numberToWords(1000)).toBe('one thousand')
  })

  it('converts 1234 to one thousand two hundred thirty four', () => {
    expect(numberToWords(1234)).toBe('one thousand two hundred thirty four')
  })

  it('converts 1000000 to one million', () => {
    expect(numberToWords(1000000)).toBe('one million')
  })

  it('converts 1234567 to one million two hundred thirty four thousand five hundred sixty seven', () => {
    expect(numberToWords(1234567)).toBe('one million two hundred thirty four thousand five hundred sixty seven')
  })

  it('converts 1000000000 to one billion', () => {
    expect(numberToWords(1000000000)).toBe('one billion')
  })

  it('converts large number', () => {
    expect(numberToWords(1234567890)).toBe('one billion two hundred thirty four million five hundred sixty seven thousand eight hundred ninety')
  })
})

describe('NumberToWords component', () => {
  it('renders with default value 1234567', () => {
    render(<NumberToWords />)
    expect(screen.getByDisplayValue('1234567')).toBeInTheDocument()
  })

  it('shows converted words by default', () => {
    render(<NumberToWords />)
    expect(screen.getByText(/million/)).toBeInTheDocument()
  })

  it('updates when number changes', () => {
    render(<NumberToWords />)
    const input = screen.getByDisplayValue('1234567')
    fireEvent.change(input, { target: { value: '42' } })
    expect(screen.getByText(/forty two/)).toBeInTheDocument()
  })

  it('shows currency format when toggle is clicked', () => {
    render(<NumberToWords />)
    const toggle = screen.getByText('💰 Currency Format')
    fireEvent.click(toggle)
    expect(screen.getByText(/dollars/)).toBeInTheDocument()
  })
})
