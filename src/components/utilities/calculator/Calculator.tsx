import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

enum Op { None, Add, Sub, Mul, Div }
const isOp = (v: string): boolean => ['+', '−', '×', '÷'].includes(v)

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState<string[]>([])
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(Op.None)
  const [reset, setReset] = useState(false)

  const press = (v: string) => {
    if (v === 'C') {
      setDisplay('0'); setPrev(null); setOp(Op.None); setReset(false)
      return
    }
    if (v === '=') {
      if (prev === null || op === Op.None) return
      const cur = parseFloat(display)
      let result = 0
      const expr = `${prev} ${['?', '+', '−', '×', '÷'][op]} ${cur} = `
      switch (op) {
        case Op.Add: result = prev + cur; break
        case Op.Sub: result = prev - cur; break
        case Op.Mul: result = prev * cur; break
        case Op.Div: result = cur !== 0 ? prev / cur : NaN; break
      }
      if (!isFinite(result)) {
        setDisplay('Error'); setPrev(null); setOp(Op.None); setReset(true)
        return
      }
      setHistory(h => [expr + result.toString(), ...h].slice(0, 20))
      setDisplay(result.toString()); setPrev(null); setOp(Op.None); setReset(true)
      return
    }
    if (isOp(v)) {
      const cur = parseFloat(display)
      if (prev !== null && op !== Op.None) {
        let result = 0
        switch (op) {
          case Op.Add: result = prev + cur; break
          case Op.Sub: result = prev - cur; break
          case Op.Mul: result = prev * cur; break
          case Op.Div: result = cur !== 0 ? prev / cur : NaN; break
        }
        if (!isFinite(result)) { setDisplay('Error'); setPrev(null); setOp(Op.None); setReset(true); return }
        setPrev(result); setDisplay(result.toString())
      } else {
        setPrev(cur)
      }
      setOp({ '+': Op.Add, '−': Op.Sub, '×': Op.Mul, '÷': Op.Div }[v]!)
      setReset(true)
      return
    }
    if (reset) { setDisplay(''); setReset(false) }
    if (v === '.' && display.includes('.')) return
    setDisplay(d => d === '0' && v !== '.' ? v : d + v)
  }

  const copyResult = () => { navigator.clipboard.writeText(display).catch(() => {}); toast.success('Copied') }

  const btn = (v: string, cls = '') => (
    <button onClick={() => press(v)} className={`h-12 rounded-lg text-lg font-medium border bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all active:scale-95 ${cls}`}>{v}</button>
  )

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="md:w-72 space-y-4">
        <div className="p-4 rounded-lg border bg-white/40 dark:bg-white/5">
          <div className="text-right text-3xl font-mono font-bold truncate">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {btn('C', 'col-span-2 bg-red-100 dark:bg-red-900/20')}
          {btn('÷', 'bg-amber-100 dark:bg-amber-900/20')}
          {btn('×', 'bg-amber-100 dark:bg-amber-900/20')}
          {btn('7')} {btn('8')} {btn('9')} {btn('−', 'bg-amber-100 dark:bg-amber-900/20')}
          {btn('4')} {btn('5')} {btn('6')} {btn('+', 'bg-amber-100 dark:bg-amber-900/20')}
          {btn('1')} {btn('2')} {btn('3')} {btn('=', 'row-span-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600')}
          {btn('0', 'col-span-2')} {btn('.')}
        </div>
        <button onClick={copyResult} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy Result</button>
      </div>

      <div className="flex-1">
        <Label>History</Label>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {history.length === 0 && <p className="text-sm text-muted-foreground">No calculations yet</p>}
          {history.map((h, i) => (
            <Card key={i} className="bg-white/30 dark:bg-white/5">
              <CardContent className="p-2 text-sm font-mono">{h}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
