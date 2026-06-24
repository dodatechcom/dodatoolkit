import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function ShadowGenerator() {
  const [offsetX, setOffsetX] = useState(4)
  const [offsetY, setOffsetY] = useState(4)
  const [blur, setBlur] = useState(10)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState('#00000033')

  const css = useMemo(() =>
    `box-shadow: ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};`,
    [offsetX, offsetY, blur, spread, color]
  )

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {})
    toast.success('CSS copied')
  }

  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <input
          type="number"
          value={value}
          onChange={e => set(Math.max(min, Math.min(max, parseInt(e.target.value) || 0)))}
          className="w-16 px-2 py-0.5 text-xs rounded border bg-white/50 dark:bg-white/5 text-center"
        />
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => set(parseInt(e.target.value))} className="w-full" aria-label={label} />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {slider('Offset X', offsetX, setOffsetX, -50, 50)}
          {slider('Offset Y', offsetY, setOffsetY, -50, 50)}
          {slider('Blur', blur, setBlur, 0, 100)}
          {slider('Spread', spread, setSpread, -50, 50)}

          <div>
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
              <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono text-sm flex-1" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={copy} size="sm">📋 Copy CSS</Button>
          </div>

          <div>
            <Label>CSS</Label>
            <code className="block p-3 rounded-lg bg-white/40 dark:bg-white/5 text-xs font-mono break-all border">
              {css}
            </code>
          </div>
        </div>

        <div>
          <Label>Preview</Label>
          <div className="rounded-xl border h-64 flex items-center justify-center bg-white/60 dark:bg-white/5" style={{ boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}` }}>
            <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium"
              style={{ boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}` }}>
              Box Shadow
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}