import { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

const samples = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
  'How razorback-jumping frogs can level six piqued gymnasts. The five boxing wizards jump quickly.',
  'Sphinx of black quartz judge my vow. Waltz bad nymph for quick jigs vex. Glib jocks quiz nymph to vex dwarf.',
  'A quick movement of the enemy will jeopardize six gunboats. All questions asked by five watched experts amaze the judge.',
  'Grumpy wizards make toxic brew for the evil queen and jack. The job requires extra pluck and zeal from every young wage earner.',
]

function calculateWPM(typed: string, elapsed: number): number {
  if (elapsed === 0) return 0
  const words = typed.trim().split(/\s+/).length
  return Math.round(words / (elapsed / 60))
}

function calculateAccuracy(typed: string, target: string): number {
  if (!typed) return 100
  let correct = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++
  }
  return Math.round((correct / typed.length) * 100)
}

export function TypingTest() {
  const [target, setTarget] = useState(() => samples[Math.floor(Math.random() * samples.length)])
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const elapsed = useMemo(() => {
    if (!startTime) return 0
    return finished ? (startTime ? (Date.now() - startTime) / 1000 : 0) : 0
  }, [startTime, finished])

  const wpm = useMemo(() => calculateWPM(typed, elapsed), [typed, elapsed])
  const accuracy = useMemo(() => calculateAccuracy(typed, target), [typed, target])

  useEffect(() => {
    if (!finished && typed.length === target.length) {
      setFinished(true)
    }
  }, [typed, target, finished])

  const handleChange = (value: string) => {
    if (finished) return
    if (!startTime && value.length === 1) setStartTime(Date.now())
    setTyped(value)
  }

  const reset = () => {
    setTarget(samples[Math.floor(Math.random() * samples.length)])
    setTyped('')
    setStartTime(null)
    setFinished(false)
    inputRef.current?.focus()
  }

  const renderChars = () => {
    return target.split('').map((char, i) => {
      let cls = ''
      if (i < typed.length) {
        cls = typed[i] === char ? 'text-green-500' : 'text-red-500 bg-red-100 dark:bg-red-900/30'
      } else if (i === typed.length) {
        cls = 'border-l-2 border-indigo-400 animate-pulse'
      } else {
        cls = 'text-muted-foreground'
      }
      return <span key={i} className={cls}>{char}</span>
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">⌨️ Typing Test</Badge>
        <Button onClick={reset} size="sm">🔄 New Text</Button>
      </div>

      {!finished && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>⏱️ {startTime ? 'In progress...' : 'Start typing to begin'}</span>
          {startTime && !finished && (
            <span>📝 {typed.length}/{target.length} chars</span>
          )}
        </div>
      )}

      <Card className="bg-white/40 dark:bg-white/5">
        <CardContent className="p-4">
          <div className="text-lg leading-relaxed font-mono tracking-wide mb-4 select-none">
            {renderChars()}
          </div>
          <Textarea
            ref={inputRef}
            value={typed}
            onChange={e => handleChange(e.target.value)}
            rows={3}
            className="font-mono text-sm"
            placeholder="Start typing here..."
            disabled={finished}
          />
        </CardContent>
      </Card>

      {finished && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-indigo-50/50 dark:bg-indigo-900/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-indigo-500">{wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-500">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 dark:bg-amber-900/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-500">{elapsed.toFixed(1)}s</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}