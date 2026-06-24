import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function TimestampConverter() {
  const [unixInput, setUnixInput] = useState(Math.floor(Date.now() / 1000).toString())
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16))

  const unixResult = useMemo(() => {
    const ts = parseInt(unixInput)
    if (isNaN(ts)) return null
    const d = new Date(ts * 1000)
    return {
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString(),
    }
  }, [unixInput])

  const dateResult = useMemo(() => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return null
    return {
      unix: Math.floor(d.getTime() / 1000),
      unixMs: d.getTime(),
      utc: d.toUTCString(),
      iso: d.toISOString(),
    }
  }, [dateInput])

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Unix Timestamp (seconds)</Label>
            <Input
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              className="font-mono"
            />
          </div>
          {unixResult && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'UTC', value: unixResult.utc },
                { label: 'ISO 8601', value: unixResult.iso },
                { label: 'Local', value: unixResult.local },
                { label: 'Date', value: unixResult.date },
                { label: 'Time', value: unixResult.time },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => copy(item.value)}
                  className="p-3 rounded-xl bg-accent/50 hover:bg-accent transition-all text-left"
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-mono truncate">{item.value}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          {dateResult && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Unix (seconds)', value: dateResult.unix.toString() },
                { label: 'Unix (ms)', value: dateResult.unixMs.toString() },
                { label: 'UTC', value: dateResult.utc },
                { label: 'ISO 8601', value: dateResult.iso },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => copy(item.value)}
                  className="p-3 rounded-xl bg-accent/50 hover:bg-accent transition-all text-left"
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-mono truncate">{item.value}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
