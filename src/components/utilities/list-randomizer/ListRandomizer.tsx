import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function ListRandomizer() {
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDavid\nEve')
  const [results, setResults] = useState<{ shuffled: string[]; picked: string | null }>({ shuffled: [], picked: null })

  function shuffle() {
    const items = input.split('\n').filter(Boolean)
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setResults({ shuffled, picked: null })
  }

  function pickRandom() {
    const items = input.split('\n').filter(Boolean)
    if (items.length === 0) return
    const picked = items[Math.floor(Math.random() * items.length)]
    setResults({ shuffled: [], picked })
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-lg space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <label className="text-sm font-medium">Enter items (one per line)</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Item 1\nItem 2\nItem 3"
            className="min-h-[180px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={shuffle} variant="glass">🔀 Shuffle All</Button>
            <Button onClick={pickRandom} variant="glass">🎯 Pick Random</Button>
          </div>
        </CardContent>
      </Card>

      {results.picked && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">Random Pick</p>
            <div className="text-3xl font-bold bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {results.picked}
            </div>
            <Button onClick={() => copy(results.picked!)} variant="ghost" size="sm" className="mt-2">
              📋 Copy
            </Button>
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
                <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
                <span className="flex-1">{item}</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">📋</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
