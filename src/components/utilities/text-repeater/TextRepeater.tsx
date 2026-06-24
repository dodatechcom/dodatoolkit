import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function TextRepeater() {
  const [text, setText] = useState('Hello!')
  const [count, setCount] = useState('5')
  const [separator, setSeparator] = useState('\n')
  const [output, setOutput] = useState('')

  function repeat() {
    const n = Math.max(1, Math.min(10000, parseInt(count) || 1))
    const sep = separator === '\\n' ? '\n' : separator === '\\t' ? '\t' : separator === ',' ? ', ' : separator || ''
    setOutput(Array(n).fill(text).join(sep))
  }

  function copy() {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Text to repeat</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Times</Label>
              <Input type="number" min="1" max="10000" value={count} onChange={(e) => setCount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Separator</Label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="\n">New Line</option>
                <option value=" ">Space</option>
                <option value=", ">Comma</option>
                <option value="\t">Tab</option>
                <option value="">None</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <Button onClick={repeat} variant="glass" className="w-full" size="lg">
            🔁 Repeat
          </Button>
        </CardContent>
      </Card>

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{output.length.toLocaleString()} chars</Badge>
              <Button onClick={copy} variant="ghost" size="sm">📋 Copy</Button>
            </div>
            <Textarea value={output} readOnly className="min-h-[200px] font-mono text-sm" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
