import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(/-+/g, separator)
    .replace(/^-|-$/g, '')
}

export function TextToSlug() {
  const [input, setInput] = useState('Hello World! This is a Slug.')
  const [separator, setSeparator] = useState('-')

  const slug = useMemo(() => toSlug(input, separator), [input, separator])

  const copy = () => { navigator.clipboard.writeText(slug).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">Slug</Badge>
        <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>
      </div>

      <div>
        <Label>Text</Label>
        <Textarea value={input} onChange={e => setInput(e.target.value)} rows={4} />
      </div>

      <div className="flex items-center gap-3">
        <Label>Separator</Label>
        {['-', '_', '.'].map(s => (
          <button key={s} onClick={() => setSeparator(s)}
            className={`px-3 py-1 text-sm rounded-md border ${separator === s ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>{s}</button>
        ))}
      </div>

      <div>
        <Label>Slug</Label>
        <Card className="bg-indigo-50/50 dark:bg-indigo-900/10">
          <CardContent className="p-3 font-mono text-lg break-all">{slug}</CardContent>
        </Card>
      </div>
    </div>
  )
}
