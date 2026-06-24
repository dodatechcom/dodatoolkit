import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 20)
}

async function bubbleSort(arr: number[], setArr: (a: number[]) => void, speed: number): Promise<void> {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]] }
      setArr([...a])
      await new Promise(r => setTimeout(r, speed))
    }
  }
}

async function quickSort(arr: number[], setArr: (a: number[]) => void, speed: number): Promise<void> {
  const a = [...arr]
  async function sort(lo: number, hi: number) {
    if (lo >= hi) return
    const pivot = a[hi]
    let i = lo
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++ }
    }
    [a[i], a[hi]] = [a[hi], a[i]]
    setArr([...a])
    await new Promise(r => setTimeout(r, speed))
    await sort(lo, i - 1)
    await sort(i + 1, hi)
  }
  await sort(0, a.length - 1)
}

async function mergeSort(arr: number[], setArr: (a: number[]) => void, speed: number): Promise<void> {
  const a = [...arr]
  async function sort(lo: number, hi: number) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    await sort(lo, mid)
    await sort(mid + 1, hi)
    const temp: number[] = []
    let i = lo, j = mid + 1
    while (i <= mid && j <= hi) temp.push(a[i] < a[j] ? a[i++] : a[j++])
    while (i <= mid) temp.push(a[i++])
    while (j <= hi) temp.push(a[j++])
    for (let k = 0; k < temp.length; k++) { a[lo + k] = temp[k]; setArr([...a]); await new Promise(r => setTimeout(r, speed)) }
  }
  await sort(0, a.length - 1)
}

const algos: Record<string, (arr: number[], setArr: (a: number[]) => void, speed: number) => Promise<void>> = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
}

export function SortingViz() {
  const [arr, setArr] = useState(() => generateArray(30))
  const [algo, setAlgo] = useState('bubble')
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(20)

  const start = useCallback(async () => {
    setRunning(true)
    await algos[algo](arr, setArr, speed)
    setRunning(false)
  }, [algo, arr, speed])

  const reset = () => {
    setArr(generateArray(30))
    setRunning(false)
  }

  const maxVal = Math.max(...arr)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {['bubble', 'quick', 'merge'].map(a => (
            <button key={a} onClick={() => setAlgo(a)}
              className={`px-3 py-1.5 text-sm rounded-lg border capitalize ${algo === a ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>{a}</button>
          ))}
        </div>
        <Button onClick={start} disabled={running} size="sm">▶️ Sort</Button>
        <Button onClick={reset} disabled={running} variant="outline" size="sm">↺ Reset</Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <input type="range" min={1} max={100} value={speed} onChange={e => setSpeed(parseInt(e.target.value))} className="w-20" />
        </div>
      </div>

      <div className="flex items-end gap-[2px] h-64 rounded-lg border bg-white/30 dark:bg-white/5 p-2">
        {arr.map((v, i) => (
          <div key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${(v / maxVal) * 100}%`,
              backgroundColor: `hsl(${220 + (v / maxVal) * 120}, 70%, 55%)`,
              transition: 'height 20ms linear',
            }}
          />
        ))}
      </div>

      <Badge variant="secondary">{arr.length} items · {algo.toUpperCase()} sort</Badge>
    </div>
  )
}
