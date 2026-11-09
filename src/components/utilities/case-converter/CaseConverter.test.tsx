import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { CaseConverter, toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toTitleCase, toUpperCase, toLowerCase } from './CaseConverter'

describe('CaseConverter pure functions', () => {
  it('converts to camelCase', () => {
    expect(toCamelCase('hello world example')).toBe('helloWorldExample')
    expect(toCamelCase('Hello World')).toBe('helloWorld')
    expect(toCamelCase('foo-bar_baz')).toBe('fooBarBaz')
  })

  it('converts to PascalCase', () => {
    expect(toPascalCase('hello world example')).toBe('HelloWorldExample')
    expect(toPascalCase('foo-bar_baz')).toBe('FooBarBaz')
  })

  it('converts to snake_case', () => {
    expect(toSnakeCase('hello world example')).toBe('hello_world_example')
    expect(toSnakeCase('helloWorld')).toBe('hello_world')
    expect(toSnakeCase('HelloWorld')).toBe('hello_world')
  })

  it('converts to kebab-case', () => {
    expect(toKebabCase('hello world example')).toBe('hello-world-example')
    expect(toKebabCase('helloWorld')).toBe('hello-world')
    expect(toKebabCase('HelloWorld')).toBe('hello-world')
  })

  it('converts to Title Case', () => {
    expect(toTitleCase('hello world example')).toBe('Hello World Example')
    expect(toTitleCase('foo bar')).toBe('Foo Bar')
  })

  it('converts to UPPERCASE', () => {
    expect(toUpperCase('hello world')).toBe('HELLO WORLD')
  })

  it('converts to lowercase', () => {
    expect(toLowerCase('HELLO WORLD')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(toCamelCase('')).toBe('')
    expect(toPascalCase('')).toBe('')
    expect(toSnakeCase('')).toBe('')
    expect(toKebabCase('')).toBe('')
    expect(toTitleCase('')).toBe('')
    expect(toUpperCase('')).toBe('')
    expect(toLowerCase('')).toBe('')
  })
})

describe('CaseConverter component', () => {
  it('renders with default text', () => {
    render(<CaseConverter />)
    expect(screen.getByDisplayValue('hello world example')).toBeInTheDocument()
  })

  it('updates textarea on user input', () => {
    render(<CaseConverter />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'new text' } })
    expect(screen.getByDisplayValue('new text')).toBeInTheDocument()
  })

  it('shows results after clicking Convert All', () => {
    render(<CaseConverter />)
    const button = screen.getByText('🔄 Convert All')
    fireEvent.click(button)
    expect(screen.getByText('camelCase')).toBeInTheDocument()
    expect(screen.getByText('PascalCase')).toBeInTheDocument()
    expect(screen.getByText('snake_case')).toBeInTheDocument()
    expect(screen.getByText('kebab-case')).toBeInTheDocument()
    expect(screen.getByText('Title Case')).toBeInTheDocument()
    expect(screen.getByText('UPPERCASE')).toBeInTheDocument()
    expect(screen.getByText('lowercase')).toBeInTheDocument()
  })

  it('shows char count badge when input has text', () => {
    render(<CaseConverter />)
    expect(screen.getByText('19 chars')).toBeInTheDocument()
  })

  it('does not show results when input is empty and convert clicked', () => {
    render(<CaseConverter />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: '' } })
    const button = screen.getByText('🔄 Convert All')
    fireEvent.click(button)
    expect(screen.queryByText('camelCase')).not.toBeInTheDocument()
  })
})
