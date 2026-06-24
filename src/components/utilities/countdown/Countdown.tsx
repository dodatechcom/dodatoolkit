import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function Countdown() {
  const [target, setTarget] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 16)
  })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = useMemo(() => {
    const t = new Date(target).getTime() - now
    return t > 0 ? t : 0
  }, [target, now])

  const parts = useMemo(() => {
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return [
      { label: 'Days', value: d },
      { label: 'Hours', value: h },
      { label: 'Minutes', value: m },
      { label: 'Seconds', value: s },
    ]
  }, [diff])

  const presets = [
    { label: '24h', get: () => { const d = new Date(); d.setHours(d.getHours() + 24); return d.toISOString().slice(0, 16) } },
    { label: '7 days', get: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 16) } },
    { label: 'New Year', get: () => `${new Date().getFullYear() + 1}-01-01T00:00` },
    { label: 'End of month', get: () => { const d = new Date(); d.setMonth(d.getMonth() + 1, 0); return d.toISOString().slice(0, 16) } },
  ]

  return (
    <div className="space-y-4 max-w-lg mx-auto text-center">
      <div className="flex items-center gap-2">
        <Input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} className="font-mono flex-1" />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map(p => (
          <button key={p.label} onClick={() => setTarget(p.get())}
            className="px-3 py-1 text-xs rounded-md border bg-white/30 dark:bg-white/5 hover:bg-white/50">{p.label}</button>
        ))}
      </div>

      {diff > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {parts.map(p => (
            <Card key={p.label} className="bg-indigo-50/50 dark:bg-indigo-900/10">
              <CardContent className="p-4">
                <div className="text-3xl font-bold font-mono text-indigo-500">{p.value.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">🎉 Time has arrived!</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
