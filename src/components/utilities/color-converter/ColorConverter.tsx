import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const [rs, gs, bs] = [r, g, b].map(v => v / 255)
  const max = Math.max(rs, gs, bs), min = Math.min(rs, gs, bs)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rs) h = ((gs - bs) / d + (gs < bs ? 6 : 0)) * 60
    else if (max === gs) h = ((bs - rs) / d + 2) * 60
    else h = ((rs - gs) / d + 4) * 60
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255]
  const k = 1 - Math.max(rs, gs, bs)
  if (k === 1) return [0, 0, 0, 100]
  const c = ((1 - rs - k) / (1 - k)) * 100
  const m = ((1 - gs - k) / (1 - k)) * 100
  const y = ((1 - bs - k) / (1 - k)) * 100
  return [Math.round(c), Math.round(m), Math.round(y), Math.round(k * 100)]
}

export function ColorConverter() {
  const [hex, setHex] = useState('#6366f1')

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const [h, s, l] = useMemo(() => rgb ? rgbToHsl(...rgb) : [0, 0, 0], [rgb])
  const [c, m, y, k] = useMemo(() => rgb ? rgbToCmyk(...rgb) : [0, 0, 0, 0], [rgb])

  const valid = rgb !== null

  const copy = (val: string) => { navigator.clipboard.writeText(val).catch(() => {}); toast.success('Copied') }

  const formats = [
    { label: 'HEX', value: hex, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'RGB', value: rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : '—', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'HSL', value: valid ? `hsl(${h}, ${s}%, ${l}%)` : '—', color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'CMYK', value: valid ? `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` : '—', color: 'bg-orange-100 dark:bg-orange-900/20' },
  ]

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Input type="color" value={valid ? hex : '#000000'} onChange={e => setHex(e.target.value)} className="w-16 h-12 p-1 cursor-pointer" />
        <Input value={hex} onChange={e => setHex(e.target.value)} className="font-mono flex-1" placeholder="#000000" />
      </div>

      <div className="h-24 rounded-xl border flex items-center justify-center text-xl font-bold transition-all"
        style={{ backgroundColor: valid ? hex : '#fff', color: valid ? (h > 180 ? '#fff' : '#000') : '#000' }}>
        {valid ? 'Sample Text' : 'Invalid Color'}
      </div>

      <div className="space-y-2">
        {formats.map(f => (
          <Card key={f.label} className={`${f.color} cursor-pointer hover:shadow-sm transition-shadow`} onClick={() => copy(f.value)}>
            <CardContent className="p-3 flex items-center justify-between">
              <Badge variant="outline">{f.label}</Badge>
              <span className="font-mono text-sm">{f.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
