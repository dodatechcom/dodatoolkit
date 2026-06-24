import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function DecisionMaker() {
  const [options, setOptions] = useState('Pizza\nSushi\nTacos\nRamen')
  const [choosing, setChoosing] = useState(false)
  const [result, setResult] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const list = options.split('\n').map(o => o.trim()).filter(Boolean)

  const pick = () => {
    if (list.length < 2) { toast.error('Enter at least 2 options'); return }
    setChoosing(true); setResult('')
    let i = 0
    const interval = setInterval(() => {
      setResult(list[i % list.length])
      i++
    }, 80)
    intervalRef.current = interval
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      const final = list[Math.floor(Math.random() * list.length)]
      setResult(final)
      setChoosing(false)
      toast.success(`🎯 ${final}`)
    }, 2000)
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <Label>Options (one per line)</Label>
        <textarea value={options} onChange={e => setOptions(e.target.value)} rows={8}
          className="w-full rounded-lg border bg-white/50 dark:bg-white/5 p-3 text-sm font-mono resize-none" />
        <div className="text-xs text-muted-foreground mt-1">{list.length} options</div>
      </div>

      <Button onClick={pick} disabled={choosing} size="lg" className="w-full text-lg">
        {choosing ? '🎰 Choosing...' : '🎯 Pick One!'}
      </Button>

      {result && (
        <Card className={`text-center ${choosing ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'bg-green-50/50 dark:bg-green-900/10 border-green-300'}`}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold font-mono">{result}</div>
            {!choosing && (
              <Button onClick={() => { navigator.clipboard.writeText(result).then(() => toast.success('Copied'), () => toast.error('Copy failed')) }} variant="ghost" size="sm" className="mt-2">📋 Copy</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
