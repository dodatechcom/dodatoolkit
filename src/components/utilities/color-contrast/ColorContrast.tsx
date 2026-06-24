import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)
  if (!m) return null
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(fg: string, bg: string): number {
  const f = hexToRgb(fg); const b = hexToRgb(bg)
  if (!f || !b) return 0
  const l1 = relativeLuminance(f); const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2); const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function wcagLevel(ratio: number, size: 'small' | 'large'): { AA: boolean; AAA: boolean } {
  const aa = size === 'small' ? ratio >= 4.5 : ratio >= 3
  const aaa = size === 'small' ? ratio >= 7 : ratio >= 4.5
  return { AA: aa, AAA: aaa }
}

export function ColorContrast() {
  const [fg, setFg] = useState('#1a1a1a')
  const [bg, setBg] = useState('#ffffff')
  const [size, setSize] = useState<'small' | 'large'>('small')

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg])
  const levels = useMemo(() => wcagLevel(ratio, size), [ratio, size])
  const isValid = useMemo(() => hexToRgb(fg) && hexToRgb(bg), [fg, bg])

  const preview = useMemo(() => {
    const bgRgb = hexToRgb(bg)
    return bgRgb ? { r: bgRgb[0], g: bgRgb[1], b: bgRgb[2] } : null
  }, [bg])

  const copy = () => {
    navigator.clipboard.writeText(`Contrast ratio: ${ratio.toFixed(2)}:1 | AA: ${levels.AA ? '✓' : '✗'} | AAA: ${levels.AAA ? '✓' : '✗'}`).catch(() => {})
    toast.success('Copied')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Foreground</Label>
          <Input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-12 p-1 cursor-pointer" />
          <Input value={fg} onChange={e => setFg(e.target.value)} className="font-mono text-sm mt-1" maxLength={7} />
        </div>
        <div>
          <Label>Background</Label>
          <Input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-12 p-1 cursor-pointer" />
          <Input value={bg} onChange={e => setBg(e.target.value)} className="font-mono text-sm mt-1" maxLength={7} />
        </div>
      </div>

      {isValid && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-lg font-mono">{ratio.toFixed(2)}:1</Badge>
            <div className="flex gap-2">
              <button onClick={() => setSize('small')} className={`px-3 py-1 text-xs rounded-md border ${size === 'small' ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>Normal Text</button>
              <button onClick={() => setSize('large')} className={`px-3 py-1 text-xs rounded-md border ${size === 'large' ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>Large Text</button>
            </div>
            <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['AA', 'AAA'] as const).map(level => (
              <Card key={level} className={`${levels[level] ? 'bg-green-50 dark:bg-green-900/10 border-green-200' : 'bg-red-50 dark:bg-red-900/10 border-red-200'}`}>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{levels[level] ? '✅' : '❌'} WCAG {level}</div>
                  <div className="text-sm text-muted-foreground">Passing</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-lg border p-6 text-center text-lg transition-all" style={{ backgroundColor: bg, color: fg }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </>
      )}
    </div>
  )
}