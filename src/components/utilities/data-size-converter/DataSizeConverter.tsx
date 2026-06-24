import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const units = [
  { id: 'b', label: 'Byte', multiplier: 1 },
  { id: 'kb', label: 'Kilobyte', multiplier: 1024 },
  { id: 'mb', label: 'Megabyte', multiplier: 1024 ** 2 },
  { id: 'gb', label: 'Gigabyte', multiplier: 1024 ** 3 },
  { id: 'tb', label: 'Terabyte', multiplier: 1024 ** 4 },
  { id: 'pb', label: 'Petabyte', multiplier: 1024 ** 5 },
]

export function DataSizeConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('gb')

  const numVal = parseFloat(value) || 0
  const fromMult = units.find(u => u.id === from)?.multiplier || 1
  const bytes = numVal * fromMult

  const copy = (text: string) => { navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Value</Label>
          <Input type="number" value={value} onChange={e => setValue(e.target.value)} className="text-lg font-mono" min={0} />
        </div>
        <Select value={from} onChange={e => setFrom(e.target.value)}
          options={units.map(u => ({ value: u.id, label: u.label }))} className="w-32" />
      </div>

      <div className="space-y-2">
        {units.filter(u => u.id !== from).map(u => {
          const result = bytes / u.multiplier
          return (
            <div key={u.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-white/5 border hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => copy(`${result.toFixed(4)} ${u.label}s`)}>
              <span className="text-sm font-medium">{u.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                <Badge variant="outline" className="text-[10px]">{u.id.toUpperCase()}</Badge>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
