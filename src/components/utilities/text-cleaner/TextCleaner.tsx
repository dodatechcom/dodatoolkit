import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function TextCleaner() {
  const [input, setInput] = useState('<p>Hello  World!</p>\n\n<p>This has   extra   spaces.</p>')
  const [output, setOutput] = useState('')

  const apply = (type: string) => {
    let t = input
    switch (type) {
      case 'strip-html': t = t.replace(/<[^>]*>/g, ''); break
      case 'collapse-spaces': t = t.replace(/[ \t]+/g, ' '); break
      case 'trim-lines': t = t.split('\n').map(l => l.trim()).join('\n'); break
      case 'remove-empty-lines': t = t.split('\n').filter(l => l.trim()).join('\n'); break
      case 'extra-whitespace': t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); break
      case 'remove-non-ascii': t = t.replace(/[^\x20-\x7E\n]/g, ''); break
      case 'lowercase': t = t.toLowerCase(); break
      case 'uppercase': t = t.toUpperCase(); break
      case 'capitalize': t = t.replace(/\b\w/g, c => c.toUpperCase()); break
    }
    setOutput(t)
  }

  const copy = () => { navigator.clipboard.writeText(output).catch(() => {}); toast.success('Copied') }

  const actions = [
    { id: 'strip-html', label: 'Strip HTML', emoji: '🏷️' },
    { id: 'collapse-spaces', label: 'Collapse Spaces', emoji: '🔲' },
    { id: 'trim-lines', label: 'Trim Lines', emoji: '✂️' },
    { id: 'remove-empty-lines', label: 'Remove Empty Lines', emoji: '📄' },
    { id: 'extra-whitespace', label: 'Extra Whitespace', emoji: '🧹' },
    { id: 'remove-non-ascii', label: 'Remove Non-ASCII', emoji: '🔤' },
    { id: 'lowercase', label: 'Lowercase', emoji: '🔽' },
    { id: 'uppercase', label: 'Uppercase', emoji: '🔼' },
    { id: 'capitalize', label: 'Capitalize', emoji: '📗' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {actions.map(a => (
          <Button key={a.id} onClick={() => apply(a.id)} size="sm" variant="outline">{a.emoji} {a.label}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Input</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={10} className="font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Output</Label>
            {output && <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>}
          </div>
          <Textarea value={output} readOnly rows={10} className="font-mono text-sm" />
        </div>
      </div>
    </div>
  )
}
