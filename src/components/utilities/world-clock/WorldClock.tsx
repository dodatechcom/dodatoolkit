import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface Timezone {
  label: string
  tz: string
  offset: string
}

const defaults: Timezone[] = [
  { label: 'New York', tz: 'America/New_York', offset: 'UTC-5' },
  { label: 'London', tz: 'Europe/London', offset: 'UTC+0' },
  { label: 'Tokyo', tz: 'Asia/Tokyo', offset: 'UTC+9' },
  { label: 'Sydney', tz: 'Australia/Sydney', offset: 'UTC+11' },
  { label: 'Dubai', tz: 'Asia/Dubai', offset: 'UTC+4' },
  { label: 'San Francisco', tz: 'America/Los_Angeles', offset: 'UTC-8' },
]

const commonTimezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Anchorage', 'America/Phoenix', 'America/Toronto', 'America/Vancouver',
  'America/Mexico_City', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Bogota',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Europe/Rome', 'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Moscow',
  'Europe/Istanbul', 'Europe/Athens', 'Europe/Dublin', 'Europe/Zurich',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Singapore',
  'Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul',
  'Asia/Jakarta', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Taipei',
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Brisbane',
  'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu',
  'Africa/Cairo', 'Africa/Casablanca', 'Africa/Johannesburg', 'Africa/Lagos',
]

function getTimeParts(tz: string, now: number) {
  const d = new Date(now)
  const str = d.toLocaleString('en-US', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const [h, m, s] = str.split(':').map(Number)
  return { h, m, s }
}

function AnalogClock({ tz, now, size = 80 }: { tz: string; now: number; size?: number }) {
  const { h, m, s } = getTimeParts(tz, now)
  const cx = size / 2, cy = size / 2, r = size / 2 - 4
  const hAngle = ((h % 12) * 30 + m * 0.5) * Math.PI / 180
  const mAngle = (m * 6 + s * 0.1) * Math.PI / 180
  const sAngle = s * 6 * Math.PI / 180
  const hLen = r * 0.5, mLen = r * 0.7, sLen = r * 0.85

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
        const a = i * 30 * Math.PI / 180
        const inner = r * (i % 3 === 0 ? 0.82 : 0.88)
        return <line key={i} x1={cx + inner * Math.sin(a)} y1={cy - inner * Math.cos(a)} x2={cx + r * 0.93 * Math.sin(a)} y2={cy - r * 0.93 * Math.cos(a)} stroke="currentColor" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} className="text-muted-foreground/50" />
      })}
      <line x1={cx} y1={cy} x2={cx + hLen * Math.sin(hAngle)} y2={cy - hLen * Math.cos(hAngle)} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + mLen * Math.sin(mAngle)} y2={cy - mLen * Math.cos(mAngle)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + sLen * Math.sin(sAngle)} y2={cy - sLen * Math.cos(sAngle)} stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-red-500" />
      <circle cx={cx} cy={cy} r={2} fill="currentColor" />
    </svg>
  )
}

export function WorldClock() {
  const [zones, setZones] = useState<Timezone[]>(defaults)
  const [time, setTime] = useState(Date.now())
  const [custom, setCustom] = useState('')

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const addZone = () => {
    const trimmed = custom.trim()
    if (!trimmed) return
    try {
      Intl.DateTimeFormat(undefined, { timeZone: trimmed })
      const label = trimmed.split('/').pop()?.replace(/_/g, ' ') || trimmed
      setZones(z => [...z, { label, tz: trimmed, offset: '' }])
      setCustom('')
      toast.success(`Added ${label}`)
    } catch { toast.error('Invalid timezone') }
  }

  const removeZone = (idx: number) => {
    setZones(z => z.filter((_, i) => i !== idx))
  }

  const formatTime = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date(time))
    } catch { return '--:--:--' }
  }

  const formatDate = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date(time))
    } catch { return '' }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border-teal-200 dark:border-teal-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && addZone()}
              list="tz-suggestions"
              placeholder="Type a city or timezone (e.g. Asia/Kolkata)..."
              className="flex-1 font-mono text-sm" />
            <datalist id="tz-suggestions">
              {commonTimezones.map(tz => <option key={tz} value={tz} />)}
            </datalist>
            <Button onClick={addZone} size="sm">➕ Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((z, i) => (
          <Card key={i} className="bg-white/40 dark:bg-white/5 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{z.tz}</Badge>
                <button onClick={() => removeZone(i)} className="text-xs text-muted-foreground hover:text-red-500">✕</button>
              </div>
              <div className="flex items-center gap-4">
                <AnalogClock tz={z.tz} now={time} />
                <div>
                  <div className="text-2xl font-bold font-mono tracking-tight">{formatTime(z.tz)}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{formatDate(z.tz)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{z.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
