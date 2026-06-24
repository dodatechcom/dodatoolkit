import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const fonts: Record<string, Record<string, string[]>> = {
  simple: {
    A: [' ██ ', '███ ', ' ██ '], B: ['███ ', '███ ', '███ '], C: [' ██ ', '█   ', ' ██ '],
    D: ['███ ', '█ █ ', '███ '], E: ['███ ', '██  ', '███ '], F: ['███ ', '██  ', '█   '],
    G: [' ██ ', '█ ██', ' ██ '], H: ['█ █ ', '███ ', '█ █ '], I: ['███', ' █ ', '███'],
    J: ['  █', '  █', '██ '], K: ['█ █', '██ ', '█ █'], L: ['█   ', '█   ', '███'],
    M: ['█ █', '███', '█ █'], N: ['█ █', '███', '█ █'], O: [' █ ', '█ █', ' █ '],
    P: ['███ ', '███ ', '█   '], Q: [' ██ ', '█ ██', ' ██ '], R: ['███ ', '███ ', '█ █ '],
    S: [' ██ ', ' █  ', '██  '], T: ['███', ' █ ', ' █ '], U: ['█ █', '█ █', ' █ '],
    V: ['█ █', '█ █', ' █ '], W: ['█ █', '███', '█ █'], X: ['█ █', ' █ ', '█ █'],
    Y: ['█ █', ' █ ', ' █ '], Z: ['███', ' █ ', '███'],
  },
  blocks: {
    A: ['████', '████', '████'], B: ['███ ', '███ ', '███ '], C: [' ███', '█   ', ' ███'],
    D: ['███ ', '█ ██', '███ '], E: ['████', '███ ', '████'], F: ['████', '███ ', '█   '],
    G: [' ███', '█ ██', ' ███'], H: ['█ █ ', '████', '█ █ '], I: ['███', ' █ ', '███'],
    J: ['  ██', '   █', ' ██ '], K: ['█ █ ', '██  ', '█ █ '], L: ['█   ', '█   ', '████'],
    M: ['█ █', '███', '█ █'], N: ['█  █', '██ █', '█ ██'], O: [' ██ ', '█  █', ' ██ '],
    P: ['███ ', '███ ', '█   '], Q: [' ██ ', '█ ██', ' ██ '], R: ['███ ', '██ █', '█ █ '],
    S: [' ███', ' █  ', '███ '], T: ['████', ' █  ', ' █  '], U: ['█ █ ', '█ █ ', ' ██ '],
    V: ['█ █', '█ █', ' █ '], W: ['█ █', '███', '█ █'], X: ['█ █', ' █ ', '█ █'],
    Y: ['█ █', ' █ ', ' █ '], Z: ['████', '  █ ', '████'],
  },
}

function mapFont(ch: string): string {
  const m: Record<string, string> = { 'A': 'Δ', 'B': 'ß', 'E': 'Σ', 'F': 'ƒ', 'G': 'Γ', 'H': 'Η', 'I': 'Ι', 'K': 'Κ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Ρ', 'S': 'Σ', 'T': 'Τ', 'X': 'Χ', 'Y': 'Υ', 'Z': 'Ζ' }
  return m[ch.toUpperCase()] || ch
}

export function AsciiArt() {
  const [text, setText] = useState('HELLO')
  const [font, setFont] = useState('simple')

  const art = useMemo(() => {
    const f = fonts[font]
    if (!f) return 'Font not found'
    const lines: string[] = []
    const chars = text.toUpperCase().split('')
    for (let row = 0; row < 3; row++) {
      let line = ''
      for (const ch of chars) {
        const glyph = f[ch] || ['   ', ' ? ', '   ']
        line += glyph[row] + '  '
      }
      lines.push(line)
    }
    return lines.join('\n')
  }, [text, font])

  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." className="font-mono max-w-xs" />
        <div className="flex gap-1">
          {Object.keys(fonts).map(f => (
            <button key={f} onClick={() => setFont(f)}
              className={`px-3 py-1 text-sm rounded-md border capitalize ${font === f ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>{f}</button>
          ))}
        </div>
      </div>

      <pre className="p-4 rounded-lg border bg-black/5 dark:bg-white/5 font-mono text-sm leading-relaxed overflow-x-auto">
        {art || 'Enter text to generate ASCII art'}
      </pre>

      {art && <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>}
    </div>
  )
}
