import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function formatGQL(query: string): string {
  let depth = 0
  const lines: string[] = []
  let current = ''
  const push = () => { if (current.trim()) lines.push('  '.repeat(depth) + current.trim()); current = '' }

  for (const ch of query) {
    if ('{(' .includes(ch)) {
      current += ch; push(); depth++
    } else if ('})'.includes(ch)) {
      if (current.trim()) push()
      depth = Math.max(0, depth - 1)
      current += ch; push()
    } else if (ch === '\n' || ch === '\r') {
      if (current.trim()) push()
    } else if (ch === ' ') {
      if (current.trim()) current += ' '
    } else {
      current += ch
    }
  }
  if (current.trim()) push()
  return lines.join('\n').replace(/  +/g, ' ').replace(/\(\s/g, '(').replace(/\s\)/g, ')')
}

const sample = `query { user(id: "1") { name email posts { title content } } }`

export function GraphqlFormatter() {
  const [input, setInput] = useState(sample)
  const [minified, setMinified] = useState(false)

  const output = useMemo(() => {
    try {
      return formatGQL(input)
    } catch { return input }
  }, [input, minified])

  const doMinify = () => {
    setMinified(true)
    setInput(input.replace(/\s+/g, ' ').trim())
    setTimeout(() => setMinified(false), 100)
  }

  const copy = () => { navigator.clipboard.writeText(output).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">GraphQL</Badge>
        <Button onClick={() => setInput(formatGQL(input))} size="sm">✨ Format</Button>
        <Button onClick={doMinify} variant="outline" size="sm">📦 Minify</Button>
        <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Input</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={14} className="font-mono text-sm" />
        </div>
        <div>
          <Label>Formatted</Label>
          <Textarea value={output} readOnly rows={14} className="font-mono text-sm" />
        </div>
      </div>
    </div>
  )
}
