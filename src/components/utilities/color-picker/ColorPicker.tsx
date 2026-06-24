import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function generatePalette(hex: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const palette: string[] = [hex]
  for (let i = 1; i <= 4; i++) {
    const factor = 1 - i * 0.15
    const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)))
    const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)))
    const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)))
    palette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
  }
  for (let i = 1; i <= 3; i++) {
    const factor = 1 + i * 0.15
    const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)))
    const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)))
    const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)))
    palette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
  }
  return palette
}

export function ColorPicker() {
  const [color, setColor] = useState('#6366f1')

  const rgb = useMemo(() => hexToRgb(color), [color])
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb])
  const palette = useMemo(() => generatePalette(color), [color])

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`), () => toast.error('Copy failed'))
  }

  function handleInputChange(value: string) {
    if (/^#[0-9a-fA-F]{0,6}$/.test(value)) {
      setColor(value)
    }
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setColor(value)
    }
  }

  function handleHexBlur(value: string) {
    if (/^#[0-9a-fA-F]{3}$/.test(value)) {
      const r = value[1], g = value[2], b = value[3]
      setColor(`#${r}${r}${g}${g}${b}${b}`)
    } else if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
      setColor('#6366f1')
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl overflow-hidden">
        <div className="h-32 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: color }}>
          <span className="text-4xl drop-shadow-lg" style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            🎨
          </span>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3 items-end">
            <div className="space-y-2">
              <Label>Pick Color</Label>
              <input
                type="color"
                value={/#[0-9a-fA-F]{6}/.test(color) ? color : '#6366f1'}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer border border-input"
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>HEX Value</Label>
              <Input
                value={color}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={(e) => handleHexBlur(e.target.value)}
                className="font-mono text-lg font-semibold"
              />
            </div>
          </div>

          {rgb && hsl && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, copyLabel: 'RGB' },
                { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, copyLabel: 'HSL' },
                { label: 'HEX', value: color, copyLabel: 'HEX' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => copy(item.value, item.copyLabel)}
                  className="p-3 rounded-xl bg-accent/50 hover:bg-accent transition-all text-left"
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-mono font-medium truncate">{item.value}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {palette.length > 0 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6">
            <Label className="mb-3 block">Color Palette</Label>
            <div className="flex gap-2">
              {palette.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setColor(c); toast.success(`Selected ${c}`) }}
                  className="flex-1 h-16 rounded-xl border-2 border-transparent hover:border-primary transition-all hover:scale-105 shadow-inner"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
