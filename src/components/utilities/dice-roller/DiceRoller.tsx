import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const diceTypes = [
  { sides: 4, emoji: '🔺' }, { sides: 6, emoji: '🎲' }, { sides: 8, emoji: '🔶' },
  { sides: 10, emoji: '🔟' }, { sides: 12, emoji: '⏰' }, { sides: 20, emoji: '⚡' },
]

export function DiceRoller() {
  const [dice, setDice] = useState(6)
  const [count, setCount] = useState(2)
  const [results, setResults] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const roll = () => {
    setRolling(true)
    const r: number[] = []
    let frames = 0
    const id = setInterval(() => {
      if (!mountedRef.current) { clearInterval(id); return }
      r.length = 0
      for (let i = 0; i < count; i++) r.push(Math.floor(Math.random() * dice) + 1)
      setResults([...r])
      frames++
      if (frames > 15) {
        clearInterval(id); intervalRef.current = null; setRolling(false)
        toast.success(`Rolled: ${r.join(', ')}`)
      }
    }, 60)
    intervalRef.current = id
  }

  const copy = () => {
    navigator.clipboard.writeText(results.join(', ')).then(() => toast.success('Copied'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <Label>Dice</Label>
          <div className="flex gap-1 mt-1">
            {diceTypes.map(d => (
              <button key={d.sides} onClick={() => setDice(d.sides)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${dice === d.sides ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>
                {d.emoji} d{d.sides}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Count</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-8 h-8 text-sm rounded-lg border ${count === n ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={roll} disabled={rolling} size="lg" className="w-full text-lg">
        {rolling ? '🎰 Rolling...' : '🎲 Roll!'}
      </Button>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 justify-center">
            {results.map((r, i) => (
              <div key={i} className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold font-mono border-2 transition-all ${
                rolling ? 'scale-110 bg-amber-100 dark:bg-amber-900/20 border-amber-300' : 'bg-white/50 dark:bg-white/10 border-white/30'
              }`}>{r}</div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-lg">Total: {results.reduce((a, b) => a + b, 0)}</Badge>
            <Button onClick={copy} variant="ghost" size="sm" className="ml-2">📋</Button>
          </div>
        </div>
      )}

      {results.length === 0 && !rolling && (
        <div className="text-center text-muted-foreground text-sm py-8">Click Roll to throw the dice</div>
      )}
    </div>
  )
}
