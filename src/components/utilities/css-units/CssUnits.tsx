import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const baseSize = 16

export function CssUnits() {
  const [px, setPx] = useState('16')
  const [root, setRoot] = useState('16')

  const values = useMemo(() => {
    const p = parseFloat(px) || 0
    const r = parseFloat(root) || 16
    return [
      { unit: 'px', value: p.toString() },
      { unit: 'rem', value: (p / r).toFixed(4) },
      { unit: 'em', value: (p / r).toFixed(4) },
      { unit: '%', value: ((p / r) * 100).toFixed(4) },
      { unit: 'pt', value: (p * 0.75).toFixed(2) },
      { unit: 'cm', value: (p * 0.026458).toFixed(4) },
      { unit: 'mm', value: (p * 0.264583).toFixed(4) },
      { unit: 'in', value: (p * 0.010417).toFixed(4) },
      { unit: 'pc', value: (p * 0.0625).toFixed(4) },
      { unit: 'ch', value: (p / (r * 0.5)).toFixed(4) },
    ]
  }, [px, root])

  const copy = (val: string) => { navigator.clipboard.writeText(val).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Pixels (px)</Label>
          <Input type="number" value={px} onChange={e => setPx(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>Root font-size (px)</Label>
          <Input type="number" value={root} onChange={e => setRoot(e.target.value)} className="font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {values.map(v => (
          <Card key={v.unit} className="bg-white/40 dark:bg-white/5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => copy(`${v.value}${v.unit}`)}>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold font-mono">{v.value}</div>
              <div className="text-sm text-muted-foreground">{v.unit}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-16 rounded-lg border flex items-center px-4 text-lg" style={{ fontSize: `${px}px` }}>
        The quick brown fox — sample text
      </div>
    </div>
  )
}
