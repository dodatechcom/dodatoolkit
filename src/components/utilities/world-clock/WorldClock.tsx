import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
      <div className="flex items-center gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && addZone()}
          placeholder="Add timezone (e.g. Asia/Kolkata)..."
          className="flex-1 px-3 py-2 rounded-lg border bg-white/50 dark:bg-white/5 text-sm" />
        <Button onClick={addZone} size="sm">➕ Add</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((z, i) => (
          <Card key={i} className="bg-white/40 dark:bg-white/5 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{z.tz}</Badge>
                <button onClick={() => removeZone(i)} className="text-xs text-muted-foreground hover:text-red-500">✕</button>
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight">{formatTime(z.tz)}</div>
              <div className="text-sm text-muted-foreground mt-1">{formatDate(z.tz)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{z.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}