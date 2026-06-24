import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const romanMap: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
]

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return 'Out of range (1–3999)'
  let result = ''
  for (const [val, sym] of romanMap) {
    while (n >= val) { result += sym; n -= val }
  }
  return result
}

function fromRoman(r: string): number {
  const vals: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }
  let total = 0, prev = 0
  for (const ch of r.toUpperCase().split('').reverse()) {
    const v = vals[ch]
    if (!v) return NaN
    total += v < prev ? -v : v
    prev = v
  }
  return total
}

export function RomanNumerals() {
  const [num, setNum] = useState('2024')
  const [roman, setRoman] = useState('MMXXIV')

  const numResult = useMemo(() => {
    const n = parseInt(num)
    return isNaN(n) ? 'Enter a number' : toRoman(n)
  }, [num])

  const romanResult = useMemo(() => {
    const n = fromRoman(roman)
    return isNaN(n) ? 'Invalid roman numeral' : n.toString()
  }, [roman])

  const copy = (val: string) => { navigator.clipboard.writeText(val).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <Label>Number → Roman</Label>
        <Input type="number" value={num} onChange={e => setNum(e.target.value)} className="font-mono text-lg" min={1} max={3999} />
        <Card className="mt-2 bg-purple-50/50 dark:bg-purple-900/10 cursor-pointer" onClick={() => copy(numResult)}>
          <CardContent className="p-3 flex items-center justify-between">
            <span className="font-mono text-xl">{numResult}</span>
            <span className="text-xs text-muted-foreground">📋</span>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label>Roman → Number</Label>
        <Input value={roman} onChange={e => setRoman(e.target.value.toUpperCase())} className="font-mono text-lg" placeholder="MMXXIV" />
        <Card className="mt-2 bg-amber-50/50 dark:bg-amber-900/10 cursor-pointer" onClick={() => copy(romanResult)}>
          <CardContent className="p-3 flex items-center justify-between">
            <span className="font-mono text-xl">{romanResult}</span>
            <span className="text-xs text-muted-foreground">📋</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 5, 10, 50, 100, 500, 1000, 2024, 3999].map(n => (
          <button key={n} onClick={() => { setNum(n.toString()); setRoman(toRoman(n)) }}
            className="px-2 py-1 text-xs rounded border bg-white/30 dark:bg-white/5 hover:bg-white/50">{n}</button>
        ))}
      </div>
    </div>
  )
}
