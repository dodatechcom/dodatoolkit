import { useState, useMemo, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function biorhythm(days: number, period: number): number {
  return Math.sin((2 * Math.PI * days) / period)
}

export function Biorhythm() {
  const [birth, setBirth] = useState('1990-01-01')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const today = new Date()
  const birthDate = new Date(birth)
  const diffDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))

  const data = useMemo(() => {
    const points: { phys: number; emo: number; intel: number; day: number }[] = []
    for (let d = -14; d <= 14; d++) {
      points.push({
        day: d,
        phys: biorhythm(diffDays + d, 23),
        emo: biorhythm(diffDays + d, 28),
        intel: biorhythm(diffDays + d, 33),
      })
    }
    return points
  }, [diffDays])

  const todayValues = data.find(d => d.day === 0) || { phys: 0, emo: 0, intel: 0, day: 0 }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const pad = { top: 20, bottom: 20, left: 30, right: 20 }
    const chartW = W - pad.left - pad.right
    const chartH = H - pad.top - pad.bottom
    const midY = pad.top + chartH / 2

    ctx.clearRect(0, 0, W, H)

    const drawCurve = (points: number[], color: string) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      points.forEach((v, i) => {
        const x = pad.left + (i / (points.length - 1)) * chartW
        const y = midY - (v * chartH) / 2
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    const values = data.map(d => d.phys)
    const emoVals = data.map(d => d.emo)
    const intVals = data.map(d => d.intel)
    drawCurve(values, '#6366f1')
    drawCurve(emoVals, '#10b981')
    drawCurve(intVals, '#f59e0b')

    ctx.strokeStyle = '#ffffff30'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, midY)
    ctx.lineTo(W - pad.right, midY)
    ctx.stroke()

    ctx.setLineDash([])
    ctx.strokeStyle = '#ffffff20'
    ctx.font = '10px monospace'
    ctx.fillStyle = '#ffffff60'
    for (let i = -14; i <= 14; i += 7) {
      const x = pad.left + ((i + 14) / 28) * chartW
      ctx.beginPath()
      ctx.moveTo(x, pad.top)
      ctx.lineTo(x, H - pad.bottom)
      ctx.stroke()
      ctx.fillText(i.toString(), x - 3, H - 5)
    }
  }, [data])

  const daysOld = useMemo(() => {
    const d = new Date()
    const b = new Date(birth)
    const diff = d.getTime() - b.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }, [birth])

  const levels = [
    { label: 'Physical', value: todayValues.phys, color: '#6366f1', period: 23, emoji: '💪' },
    { label: 'Emotional', value: todayValues.emo, color: '#10b981', period: 28, emoji: '❤️' },
    { label: 'Intellectual', value: todayValues.intel, color: '#f59e0b', period: 33, emoji: '🧠' },
  ]

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <Label>Date of Birth</Label>
        <Input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="font-mono" />
      </div>

      <div className="text-sm text-muted-foreground">
        Day {daysOld.toLocaleString()} of life
      </div>

      <canvas ref={canvasRef} width={600} height={220} className="w-full rounded-lg border bg-black/10 dark:bg-white/5"
        style={{ maxWidth: '100%', height: 'auto', aspectRatio: '600/220' }} />

      <div className="grid grid-cols-3 gap-3">
        {levels.map(l => (
          <Card key={l.label} className="text-center bg-white/40 dark:bg-white/5">
            <CardContent className="p-3">
              <div className="text-xl">{l.emoji}</div>
              <div className="text-xs text-muted-foreground">{l.label}</div>
              <div className={`text-lg font-bold font-mono ${l.value > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {l.value > 0 ? '+' : ''}{(l.value * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-muted-foreground">{l.period}d cycle</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
