import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function RandomNumber() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [results, setResults] = useState<number[]>([])

  function generate() {
    const mn = parseInt(min)
    const mx = parseInt(max)
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100)
    if (isNaN(mn) || isNaN(mx) || mn > mx) return
    const nums: number[] = []
    for (let i = 0; i < n; i++) {
      nums.push(Math.floor(Math.random() * (mx - mn + 1)) + mn)
    }
    setResults(nums)
  }

  function copyAll() {
    navigator.clipboard.writeText(results.join('\n')).then(() => toast.success('Copied!'), () => toast.error('Copy failed'))
  }

  return (
    <div className="max-w-lg space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Min</Label>
              <Input type="number" value={min} onChange={(e) => setMin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Max</Label>
              <Input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} />
            </div>
          </div>
          <Button onClick={generate} variant="glass" className="w-full" size="lg">
            🎲 Generate
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{results.length} number{results.length > 1 ? 's' : ''}</Badge>
              <Button onClick={copyAll} variant="ghost" size="sm">📋 Copy All</Button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {results.map((num, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center font-bold text-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => { navigator.clipboard.writeText(num.toString()).then(() => toast.success('Copied!'), () => toast.error('Copy failed')) }}
                >
                  {num}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
