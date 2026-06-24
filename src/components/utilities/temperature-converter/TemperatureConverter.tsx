import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

type Unit = 'celsius' | 'fahrenheit' | 'kelvin'

function convert(value: number, from: Unit, to: Unit): number {
  let c: number
  if (from === 'celsius') c = value
  else if (from === 'fahrenheit') c = (value - 32) * 5 / 9
  else c = value - 273.15

  if (to === 'celsius') return c
  if (to === 'fahrenheit') return c * 9 / 5 + 32
  return c + 273.15
}

const units: { id: Unit; label: string; symbol: string }[] = [
  { id: 'celsius', label: 'Celsius', symbol: '°C' },
  { id: 'fahrenheit', label: 'Fahrenheit', symbol: '°F' },
  { id: 'kelvin', label: 'Kelvin', symbol: 'K' },
]

const presets = [
  { label: 'Water freezes', celsius: 0 },
  { label: 'Water boils', celsius: 100 },
  { label: 'Room temp', celsius: 22 },
  { label: 'Body temp', celsius: 37 },
  { label: 'Absolute zero', celsius: -273.15 },
  { label: 'Oven (hot)', celsius: 200 },
]

export function TemperatureConverter() {
  const [value, setValue] = useState('100')
  const [from, setFrom] = useState<Unit>('celsius')

  const numVal = parseFloat(value) || 0

  const copy = (text: string) => { navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Temperature</Label>
          <Input type="number" value={value} onChange={e => setValue(e.target.value)} className="text-lg font-mono" />
        </div>
        <select value={from} onChange={e => setFrom(e.target.value as Unit)}
          className="px-3 py-2 rounded-lg border bg-background text-sm h-10">
          {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {units.filter(u => u.id !== from).map(to => {
          const result = convert(numVal, from, to.id)
          return (
            <Card key={to.id} className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => copy(`${result.toFixed(1)}${to.symbol}`)}>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">{to.label}</p>
                <p className="text-2xl font-bold">{result.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">{to.symbol}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Common temperatures</p>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button key={p.label} onClick={() => { setValue(String(p.celsius)); setFrom('celsius') }}
              className="px-3 py-1.5 text-xs rounded-lg border bg-white/40 dark:bg-white/5 hover:bg-accent transition-colors">
              {p.label} ({p.celsius}°C)
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
