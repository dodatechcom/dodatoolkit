import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

type Phase = 'focus' | 'short-break' | 'long-break'

const DEFAULTS = { focus: 25, 'short-break': 5, 'long-break': 15 }

export function Pomodoro() {
  const [phase, setPhase] = useState<Phase>('focus')
  const [minutes, setMinutes] = useState(DEFAULTS.focus)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef(phase)
  const cyclesRef = useRef(cycles)

  phaseRef.current = phase
  cyclesRef.current = cycles

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s > 0) return s - 1
          setMinutes(m => {
            if (m > 0) return m - 1
            return 0
          })
          return 59
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  useEffect(() => {
    if (running && minutes === 0 && seconds === 0) {
      setRunning(false)
      notifyPhaseComplete()
    }
  }, [running, minutes, seconds])

  const notifyPhaseComplete = useCallback(() => {
    const currentPhase = phaseRef.current
    const currentCycles = cyclesRef.current
    if (currentPhase === 'focus') {
      const newCycles = currentCycles + 1
      setCycles(newCycles)
      if (newCycles % 4 === 0) {
        setPhase('long-break'); setMinutes(DEFAULTS['long-break']); setSeconds(0)
        toast.success('🍅 Long break time!')
      } else {
        setPhase('short-break'); setMinutes(DEFAULTS['short-break']); setSeconds(0)
        toast.success('☕ Short break!')
      }
    } else {
      setPhase('focus'); setMinutes(DEFAULTS.focus); setSeconds(0)
      toast.success('🎯 Focus time!')
    }
  }, [])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false); setMinutes(DEFAULTS[phase]); setSeconds(0)
  }

  const switchPhase = (p: Phase) => {
    setRunning(false); setPhase(p); setMinutes(DEFAULTS[p]); setSeconds(0)
  }

  const totalSeconds = minutes * 60 + seconds
  const pct = (1 - totalSeconds / (DEFAULTS[phase] * 60)) * 100

  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="max-w-sm mx-auto text-center space-y-6">
      <div className="flex justify-center gap-2">
        {(['focus', 'short-break', 'long-break'] as const).map(p => (
          <button key={p} onClick={() => switchPhase(p)}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              phase === p ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'
            }`}>
            {p === 'focus' ? '🎯 Focus' : p === 'short-break' ? '☕ Short' : '🧘 Long'}
          </button>
        ))}
      </div>

      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/20" />
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
            className={`transition-all duration-1000 ${
              phase === 'focus' ? 'stroke-indigo-500' : 'stroke-emerald-500'
            }`}
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold font-mono">{display}</div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <Button onClick={start} size="lg" className="rounded-full w-32">▶️ Start</Button>
        ) : (
          <Button onClick={pause} size="lg" variant="outline" className="rounded-full w-32">⏸️ Pause</Button>
        )}
        <Button onClick={reset} variant="outline" size="lg" className="rounded-full w-32">↺ Reset</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Cycles completed: {cycles}
      </div>
    </div>
  )
}
