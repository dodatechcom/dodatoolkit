import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function unicodeInfo(ch: string) {
  const code = ch.codePointAt(0)!
  const hex = code.toString(16).toUpperCase().padStart(4, '0')
  const utf8 = new TextEncoder().encode(ch)
  const utf8Hex = Array.from(utf8).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
  return { code, hex, utf8Hex, bytes: utf8.length }
}

export function UnicodeInspector() {
  const [input, setInput] = useState('A 😀 中 🎉')

  const chars = useMemo(() => {
    const result: { char: string; info: ReturnType<typeof unicodeInfo> }[] = []
    for (const ch of input) {
      result.push({ char: ch, info: unicodeInfo(ch) })
    }
    return result
  }, [input])

  return (
    <div className="space-y-4">
      <div>
        <Label>Text</Label>
        <Input value={input} onChange={e => setInput(e.target.value)} className="text-lg font-mono" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {chars.map((c, i) => (
          <Card key={i} className="bg-white/40 dark:bg-white/5">
            <CardContent className="p-3 text-center">
              <div className="text-3xl mb-1">{c.char === ' ' ? <span className="text-muted-foreground">␣</span> : c.char}</div>
              <div className="text-xs font-mono text-muted-foreground">U+{c.info.hex}</div>
              <div className="text-xs font-mono text-muted-foreground">{c.info.bytes}B</div>
              <div className="text-[10px] font-mono text-muted-foreground break-all">{c.info.utf8Hex}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
