import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'sql-formatter'
import toast from 'react-hot-toast'

const sample = 'SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = true GROUP BY u.id, u.name HAVING COUNT(o.id) > 0 ORDER BY order_count DESC LIMIT 10;'

export function SqlFormatter() {
  const [input, setInput] = useState(sample)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const doFormat = () => {
    setError('')
    try {
      setOutput(format(input, { language: 'sql', tabWidth: 2 }))
    } catch (e) { setError((e as Error).message) }
  }

  const minify = () => {
    setError('')
    try {
      setOutput(input.replace(/\s+/g, ' ').trim())
    } catch (e) { setError((e as Error).message) }
  }

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">SQL</Badge>
        <Button onClick={doFormat} size="sm">✨ Format</Button>
        <Button onClick={minify} variant="outline" size="sm">📦 Minify</Button>
        {output && <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>SQL Input</Label>
          <Textarea value={input} onChange={e => { setInput(e.target.value); setError('') }} rows={12} className="font-mono text-sm" />
        </div>
        <div>
          <Label>Formatted SQL</Label>
          <Textarea value={output} readOnly rows={12} className="font-mono text-sm" />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}