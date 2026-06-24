import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function TimeCalculator() {
  const [h1, setH1] = useState('10')
  const [m1, setM1] = useState('30')
  const [h2, setH2] = useState('14')
  const [m2, setM2] = useState('45')

  const t1 = parseInt(h1) * 60 + parseInt(m1)
  const t2 = parseInt(h2) * 60 + parseInt(m2)
  const diff = Math.abs(t2 - t1)
  const diffH = Math.floor(diff / 60)
  const diffM = diff % 60

  const [addH, setAddH] = useState('2')
  const [addM, setAddM] = useState('15')
  const [baseH, setBaseH] = useState('9')
  const [baseM, setBaseM] = useState('0')

  const totalAdd = parseInt(addH) * 60 + parseInt(addM)
  const baseTotal = parseInt(baseH) * 60 + parseInt(baseM)
  const resultTotal = baseTotal + totalAdd
  const resultH = ((resultTotal % 1440 + 1440) % 1440) / 60 | 0
  const resultM = ((resultTotal % 1440 + 1440) % 1440) % 60

  const copy = (text: string) => { navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-6 max-w-lg">
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Duration Between Times</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Input type="number" value={h1} onChange={e => setH1(e.target.value)} min={0} max={23} className="font-mono text-center" placeholder="HH" />
                <span className="text-lg self-center">:</span>
                <Input type="number" value={m1} onChange={e => setM1(e.target.value)} min={0} max={59} className="font-mono text-center" placeholder="MM" />
              </div>
            </div>
            <div>
              <Label>End Time</Label>
              <div className="flex gap-2">
                <Input type="number" value={h2} onChange={e => setH2(e.target.value)} min={0} max={23} className="font-mono text-center" placeholder="HH" />
                <span className="text-lg self-center">:</span>
                <Input type="number" value={m2} onChange={e => setM2(e.target.value)} min={0} max={59} className="font-mono text-center" placeholder="MM" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2">{diffH}h {diffM}m</Badge>
            <button onClick={() => copy(`${diffH}h ${diffM}m`)} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Add / Subtract Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Base Time</Label>
              <div className="flex gap-2">
                <Input type="number" value={baseH} onChange={e => setBaseH(e.target.value)} min={0} max={23} className="font-mono text-center" />
                <span className="text-lg self-center">:</span>
                <Input type="number" value={baseM} onChange={e => setBaseM(e.target.value)} min={0} max={59} className="font-mono text-center" />
              </div>
            </div>
            <div>
              <Label>Add Duration</Label>
              <div className="flex gap-2">
                <Input type="number" value={addH} onChange={e => setAddH(e.target.value)} min={0} className="font-mono text-center" />
                <span className="text-sm self-center">h</span>
                <Input type="number" value={addM} onChange={e => setAddM(e.target.value)} min={0} max={59} className="font-mono text-center" />
                <span className="text-sm self-center">m</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {String(resultH).padStart(2, '0')}:{String(resultM).padStart(2, '0')}
            </Badge>
            <button onClick={() => copy(`${String(resultH).padStart(2, '0')}:${String(resultM).padStart(2, '0')}`)} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
