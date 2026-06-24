import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function dmsToDecimal(deg: number, min: number, sec: number, dir: string): number {
  let d = deg + min / 60 + sec / 3600
  if (dir === 'S' || dir === 'W') d = -d
  return Math.round(d * 1000000) / 1000000
}

function decimalToDms(dd: number, isLat: boolean): string {
  const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W')
  const abs = Math.abs(dd)
  const deg = Math.floor(abs)
  const min = Math.floor((abs - deg) * 60)
  const sec = Math.round(((abs - deg) * 60 - min) * 60)
  return `${deg}° ${min}' ${sec}" ${dir}`
}

export function GeoCoords() {
  const [mode, setMode] = useState<'to-dms' | 'to-decimal'>('to-dms')

  // DMS inputs
  const [latDeg, setLatDeg] = useState('48')
  const [latMin, setLatMin] = useState('51')
  const [latSec, setLatSec] = useState('29')
  const [latDir, setLatDir] = useState('N')
  const [lonDeg, setLonDeg] = useState('2')
  const [lonMin, setLonMin] = useState('17')
  const [lonSec, setLonSec] = useState('40')
  const [lonDir, setLonDir] = useState('E')

  // Decimal inputs
  const [decLat, setDecLat] = useState('48.858')
  const [decLon, setDecLon] = useState('2.294')

  const dmsToDecResult = useMemo(() => {
    const lat = dmsToDecimal(parseFloat(latDeg) || 0, parseFloat(latMin) || 0, parseFloat(latSec) || 0, latDir)
    const lon = dmsToDecimal(parseFloat(lonDeg) || 0, parseFloat(lonMin) || 0, parseFloat(lonSec) || 0, lonDir)
    return `${lat}, ${lon}`
  }, [latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir])

  const decToDmsResult = useMemo(() => {
    const lat = decimalToDms(parseFloat(decLat) || 0, true)
    const lon = decimalToDms(parseFloat(decLon) || 0, false)
    return `${lat}, ${lon}`
  }, [decLat, decLon])

  const copy = (v: string) => { navigator.clipboard.writeText(v).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2 justify-center">
        <button onClick={() => setMode('to-dms')} className={`px-4 py-2 text-sm rounded-lg border ${mode === 'to-dms' ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>DMS → Decimal</button>
        <button onClick={() => setMode('to-decimal')} className={`px-4 py-2 text-sm rounded-lg border ${mode === 'to-decimal' ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>Decimal → DMS</button>
      </div>

      {mode === 'to-dms' ? (
        <div className="space-y-4">
          <div>
            <Label>Latitude (DMS)</Label>
            <div className="grid grid-cols-4 gap-2">
              <Input type="number" value={latDeg} onChange={e => setLatDeg(e.target.value)} className="font-mono" placeholder="°" />
              <Input type="number" value={latMin} onChange={e => setLatMin(e.target.value)} className="font-mono" placeholder="'" />
              <Input type="number" value={latSec} onChange={e => setLatSec(e.target.value)} className="font-mono" placeholder='"' />
              <select value={latDir} onChange={e => setLatDir(e.target.value)} className="rounded-lg border bg-background px-2 font-mono text-sm">
                <option value="N">N</option><option value="S">S</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Longitude (DMS)</Label>
            <div className="grid grid-cols-4 gap-2">
              <Input type="number" value={lonDeg} onChange={e => setLonDeg(e.target.value)} className="font-mono" placeholder="°" />
              <Input type="number" value={lonMin} onChange={e => setLonMin(e.target.value)} className="font-mono" placeholder="'" />
              <Input type="number" value={lonSec} onChange={e => setLonSec(e.target.value)} className="font-mono" placeholder='"' />
              <select value={lonDir} onChange={e => setLonDir(e.target.value)} className="rounded-lg border bg-background px-2 font-mono text-sm">
                <option value="E">E</option><option value="W">W</option>
              </select>
            </div>
          </div>
          <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200 cursor-pointer" onClick={() => copy(dmsToDecResult)}>
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Decimal</div>
              <div className="text-lg font-mono font-bold">{dmsToDecResult}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label>Latitude (Decimal)</Label>
            <Input type="number" step="0.000001" value={decLat} onChange={e => setDecLat(e.target.value)} className="font-mono" placeholder="e.g. 48.858" />
          </div>
          <div>
            <Label>Longitude (Decimal)</Label>
            <Input type="number" step="0.000001" value={decLon} onChange={e => setDecLon(e.target.value)} className="font-mono" placeholder="e.g. 2.294" />
          </div>
          <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 cursor-pointer" onClick={() => copy(decToDmsResult)}>
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">DMS</div>
              <div className="text-lg font-mono font-bold">{decToDmsResult}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
