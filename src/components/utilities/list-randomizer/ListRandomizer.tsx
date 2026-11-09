import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function ListRandomizer() {
  const [input, setInput] = useState('Pizza\nSushi\nTacos\nRamen\nBurger\nSalad')
  const [results, setResults] = useState<{ shuffled: string[]; picked: string | null }>({ shuffled: [], picked: null })
  const [isDeciding, setIsDeciding] = useState(false)
  const [animatedPick, setAnimatedPick] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function getItems() {
    return input.split('\n').map(s => s.trim()).filter(Boolean)
  }

  function shuffle() {
    const items = getItems()
    if (items.length < 2) {
      toast.error('Add at least 2 items to shuffle')
      return
    }
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setResults({ shuffled, picked: null })
    setAnimatedPick('')
    toast.success('List shuffled!')
  }

  function pickRandom() {
    const items = getItems()
    if (items.length === 0) {
      toast.error('Add at least 1 item')
      return
    }
    const picked = items[Math.floor(Math.random() * items.length)]
    setResults({ shuffled: [], picked })
    setAnimatedPick('')
    toast.success(`Picked: ${picked}`)
  }

  function spinDecision() {
    const items = getItems()
    if (items.length < 2) {
      toast.error('Add at least 2 items to make a decision')
      return
    }
    setIsDeciding(true)
    setResults({ shuffled: [], picked: null })
    let idx = 0
    intervalRef.current = setInterval(() => {
      setAnimatedPick(items[idx % items.length])
      idx++
    }, 80)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      const finalPick = items[Math.floor(Math.random() * items.length)]
      setAnimatedPick(finalPick)
      setResults({ shuffled: [], picked: finalPick })
      setIsDeciding(false)
      toast.success(`🎯 Chosen: ${finalPick}`)
    }, 1800)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  const items = getItems()

  return (
    <div className="max-w-lg space-y-4 mx-auto">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enter items (one per line)</label>
            <Badge variant="outline" className="text-xs">{items.length} items</Badge>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Item 1\nItem 2\nItem 3"
            className="min-h-[160px] font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={spinDecision} disabled={isDeciding} variant="glass">
              {isDeciding ? '🎰 Deciding...' : '🎯 Spin Decision'}
            </Button>
            <Button onClick={pickRandom} disabled={isDeciding} variant="glass">
              🎲 Pick Instant
            </Button>
            <Button onClick={shuffle} disabled={isDeciding} variant="glass">
              🔀 Shuffle All
            </Button>
          </div>
        </CardContent>
      </Card>

      {(isDeciding || results.picked) && (
        <Card className={`glass border-none shadow-xl text-center ${isDeciding ? 'animate-pulse' : ''}`}>
          <CardContent className="p-6 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {isDeciding ? 'Selecting randomly...' : '🎯 Decision / Pick'}
            </p>
            <div className="text-3xl font-bold bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent break-words">
              {isDeciding ? animatedPick : results.picked}
            </div>
            {!isDeciding && results.picked && (
              <Button onClick={() => copy(results.picked!)} variant="ghost" size="sm" className="mt-2">
                📋 Copy Pick
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {results.shuffled.length > 0 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{results.shuffled.length} items shuffled</Badge>
              <Button onClick={() => copy(results.shuffled.join('\n'))} variant="ghost" size="sm">📋 Copy All</Button>
            </div>
            {results.shuffled.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg bg-accent/30 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => copy(item)}
              >
                <span className="text-xs text-muted-foreground w-6 text-right font-mono">{i + 1}.</span>
                <span className="flex-1 text-sm">{item}</span>
                <span className="text-xs text-muted-foreground">📋</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
