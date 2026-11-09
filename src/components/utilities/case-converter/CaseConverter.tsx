import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function toTitleCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

const converters = [
  { name: 'camelCase', fn: toCamelCase, emoji: '🐫' },
  { name: 'PascalCase', fn: toPascalCase, emoji: '📐' },
  { name: 'snake_case', fn: toSnakeCase, emoji: '🐍' },
  { name: 'kebab-case', fn: toKebabCase, emoji: '🥖' },
  { name: 'Title Case', fn: toTitleCase, emoji: '📰' },
  { name: 'UPPERCASE', fn: toUpperCase, emoji: '🔠' },
  { name: 'lowercase', fn: toLowerCase, emoji: '🔡' },
]

export function CaseConverter() {
  const [input, setInput] = useState('hello world example')
  const [results, setResults] = useState<Record<string, string>>({})

  function convert() {
    if (!input.trim()) return
    const res: Record<string, string> = {}
    for (const c of converters) {
      res[c.name] = c.fn(input)
    }
    setResults(res)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input Text</label>
            {input && <Badge variant="secondary">{input.length} chars</Badge>}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            className="min-h-[100px]"
          />
          <Button onClick={convert} variant="glass">
            🔄 Convert All
          </Button>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <div className="grid gap-3">
          {converters.map((c) => (
            <Card
              key={c.name}
              className="glass border-none shadow-xl cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={() => copy(results[c.name])}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-lg">{c.emoji}</span>
                <Badge variant="outline" className="shrink-0 font-mono text-xs">
                  {c.name}
                </Badge>
                <code className="flex-1 text-sm font-mono break-all">{results[c.name]}</code>
                <span className="text-xs text-muted-foreground shrink-0">📋</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
