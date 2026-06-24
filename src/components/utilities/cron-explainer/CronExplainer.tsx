import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const fieldNames = ['minute', 'hour', 'day of month', 'month', 'day of week']

function explainField(val: string, field: number): string {
  if (val === '*') return ['every minute', 'every hour', 'every day', 'every month', 'every day of week'][field]
  if (val.includes(',')) return val.split(',').map(v => explainField(v, field)).join(', ')
  const [main, step] = val.split('/')
  const stepStr = step ? ` (every ${step}${field === 0 ? '' : ' '})` : ''
  if (main === '*') return `every ${fieldNames[field]}${stepStr}`
  if (main.includes('-')) {
    const [a, b] = main.split('-')
    return `between ${a}-${b}${stepStr}`
  }
  return `at ${main}${stepStr}`
}

const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function explain(expr: string): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid: must have exactly 5 fields'
  const fields = parts.map(explainField)
  const dow = parseInt(parts[4])
  const mo = parseInt(parts[3])
  const dom = parts[2]
  let result = 'Runs '
  if (dom === '*' && parts[4] === '*') {
    result += `${fields[0]}, ${fields[1]}, ${fields[2]}`
  } else {
    result += fields.map((f, i) => `${fieldNames[i]}: ${f}`).join('; ')
  }
  if (!isNaN(dow) && dow >= 0 && dow <= 6) result += ` (${dayNames[dow]})`
  if (!isNaN(mo) && mo >= 1 && mo <= 12) result += ` (${monthNames[mo]})`
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const presets = [
  { label: 'Every min', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Weekdays 9am', value: '0 9 * * 1-5' },
  { label: 'Monthly 1st', value: '0 0 1 * *' },
  { label: 'Every 15min', value: '*/15 * * * *' },
]

export function CronExplainer() {
  const [expr, setExpr] = useState('*/15 * * * *')

  const result = useMemo(() => explain(expr), [expr])

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div>
        <Label>Cron Expression</Label>
        <Input value={expr} onChange={e => setExpr(e.target.value)} className="font-mono text-lg" placeholder="* * * * *" />
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button key={p.value} onClick={() => setExpr(p.value)}
            className={`px-3 py-1 text-xs rounded-md border ${expr === p.value ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5 hover:bg-white/60'}`}>{p.label}</button>
        ))}
      </div>

      <Card className={result.startsWith('Runs') || result.startsWith('At') ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200' : 'bg-red-50/50 dark:bg-red-900/10 border-red-200'}>
        <CardContent className="p-4">
          <div className="font-medium">{result}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {['min', 'hour', 'day', 'month', 'weekday'].map((label, i) => (
          <div key={label} className="p-2 rounded-lg bg-white/30 dark:bg-white/5">
            <div className="font-mono font-bold text-sm">{expr.split(/\s+/)[i] || '?'}</div>
            <div className="text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
