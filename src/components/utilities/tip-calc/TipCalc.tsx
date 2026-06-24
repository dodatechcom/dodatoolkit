import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function TipCalc() {
  const [bill, setBill] = useState('56.75')
  const [tipPct, setTipPct] = useState(15)
  const [split, setSplit] = useState(2)
  const [round, setRound] = useState(false)

  const result = useMemo(() => {
    const b = parseFloat(bill) || 0
    const tip = b * (tipPct / 100)
    const total = b + tip
    const perPerson = total / split
    return {
      tip: round ? Math.ceil(tip * 20) / 20 : Math.round(tip * 100) / 100,
      total: round ? Math.ceil(total * 20) / 20 : Math.round(total * 100) / 100,
      perPerson: round ? Math.ceil(perPerson * 20) / 20 : Math.round(perPerson * 100) / 100,
      eachTip: round ? Math.ceil((tip / split) * 20) / 20 : Math.round((tip / split) * 100) / 100,
    }
  }, [bill, tipPct, split, round])

  const copy = () => {
    const t = `Bill: $${bill} | Tip: ${tipPct}% ($${result.tip}) | Total: $${result.total} | Each: $${result.perPerson}`
    navigator.clipboard.writeText(t).catch(() => {}); toast.success('Copied')
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <Label>Bill Amount ($)</Label>
        <Input type="number" step="0.01" value={bill} onChange={e => setBill(e.target.value)} className="font-mono text-lg" />
      </div>

      <div>
        <Label>Tip: {tipPct}%</Label>
        <div className="flex gap-1 flex-wrap">
          {[10, 12, 15, 18, 20, 22, 25].map(p => (
            <button key={p} onClick={() => setTipPct(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${tipPct === p ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>{p}%</button>
          ))}
        </div>
      </div>

      <div>
        <Label>Split: {split} way{split > 1 ? 's' : ''}</Label>
        <input type="range" min={1} max={10} value={split} onChange={e => setSplit(parseInt(e.target.value))} className="w-full" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="round" checked={round} onChange={e => setRound(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
        <label htmlFor="round" className="text-sm">Round to nearest $0.05</label>
      </div>

      <Card className="bg-indigo-50/50 dark:bg-indigo-900/10">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between"><span>Tip amount</span><span className="font-mono font-bold">${result.tip.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total bill</span><span className="font-mono font-bold">${result.total.toFixed(2)}</span></div>
          {split > 1 && (
            <>
              <div className="border-t border-white/20 pt-2 flex justify-between"><span>Each pays</span><span className="font-mono font-bold text-lg">${result.perPerson.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Tip each</span><span>${result.eachTip.toFixed(2)}</span></div>
            </>
          )}
        </CardContent>
      </Card>

      <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
    </div>
  )
}
