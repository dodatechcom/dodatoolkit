import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar() {
  const today = useMemo(() => new Date(), [])
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const days = useMemo(() => {
    const totalDays = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const result: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) result.push(null)
    for (let d = 1; d <= totalDays; d++) result.push(d)
    return result
  }, [year, month])

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }
  const jumpToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()) }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={prev} variant="outline" size="sm">◀</Button>
        <div className="text-lg font-bold">{monthNames[month]} {year}</div>
        <Button onClick={next} variant="outline" size="sm">▶</Button>
      </div>

      <Button onClick={jumpToday} variant="ghost" size="sm" className="w-full">📅 Today</Button>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} className={`text-center py-2 text-sm rounded-lg ${
            d === null ? '' :
            d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              ? 'bg-indigo-500 text-white font-bold'
              : 'hover:bg-white/20 bg-white/30 dark:bg-white/5'
          }`}>{d}</div>
        ))}
      </div>

      {days.filter(d => d !== null).length === 0 && <p className="text-sm text-muted-foreground text-center">No days</p>}
    </div>
  )
}
