import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<string[]>([])
  const startRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - ms
      intervalRef.current = setInterval(() => setMs(Date.now() - startRef.current), 10)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const format = (t: number) => {
    const min = Math.floor(t / 60000)
    const sec = Math.floor((t % 60000) / 1000)
    const cent = Math.floor((t % 1000) / 10)
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`
  }

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => { setRunning(false); setMs(0); setLaps([]) }
  const lap = () => {
    setLaps(l => [format(ms), ...l])
    startRef.current = Date.now()
    setMs(0)
  }

  return (
    <div className="max-w-sm mx-auto text-center space-y-6">
      <div className="text-6xl font-bold font-mono tracking-wider tabular-nums">{format(ms)}</div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <Button onClick={start} size="lg" className="rounded-full w-28">▶️ Start</Button>
        ) : (
          <Button onClick={pause} size="lg" variant="outline" className="rounded-full w-28">⏸️ Pause</Button>
        )}
        <Button onClick={lap} disabled={!running} variant="outline" size="lg" className="rounded-full w-28">⏱️ Lap</Button>
        <Button onClick={reset} variant="outline" size="lg" className="rounded-full w-28">↺ Reset</Button>
      </div>

      {laps.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {laps.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-1.5 rounded-lg bg-white/30 dark:bg-white/5 text-sm font-mono">
              <span className="text-muted-foreground">Lap {laps.length - i}</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
