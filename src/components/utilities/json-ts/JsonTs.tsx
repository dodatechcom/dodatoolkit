import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function toTypeScript(obj: unknown, name: string, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'any[]'
    const itemType = toTypeScript(obj[0], `${name}Item`, indent)
    return `${itemType}[]`
  }
  if (obj !== null && typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return 'Record<string, unknown>'
    const fields = entries.map(([k, v]) => {
      const val = toTypeScript(v, `${name}${k}`, indent + 1)
      return `${pad}  ${k}: ${val}`
    })
    return `{\n${fields.join(';\n')};\n${pad}}`
  }
  if (typeof obj === 'string') return 'string'
  if (typeof obj === 'number') return 'number'
  if (typeof obj === 'boolean') return 'boolean'
  return 'unknown'
}

const sample = { name: 'John', age: 30, active: true, tags: ['admin', 'user'] }

export function JsonTs() {
  const [input, setInput] = useState(JSON.stringify(sample, null, 2))
  const [name, setName] = useState('MyInterface')

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input)
      const ts = toTypeScript(parsed, name)
      return { ok: true as const, code: `interface ${name} ${ts}` }
    } catch (e) {
      return { ok: false as const, error: (e as Error).message }
    }
  }, [input, name])

  const copy = () => {
    if (result.ok) {
      navigator.clipboard.writeText(result.code).catch(() => {})
      toast.success('Copied TypeScript interface')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">JSON → TypeScript</Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Name:</span>
              <Input value={name} onChange={e => setName(e.target.value)} className="w-36 h-8 text-sm font-mono" />
            </div>
            {result.ok && <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/40 dark:bg-white/5 border-border/50">
          <CardContent className="p-4">
            <Label>JSON Input</Label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} rows={14} className="font-mono text-sm mt-1.5" />
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-white/5 border-border/50">
          <CardContent className="p-4">
            <Label>TypeScript Interface</Label>
            <Textarea value={result.ok ? result.code : result.error} readOnly rows={14} className="font-mono text-sm mt-1.5" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
