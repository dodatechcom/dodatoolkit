import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import toast from 'react-hot-toast'

export function DateCalculator() {
  const [tab, setTab] = useState('diff')
  const [date1, setDate1] = useState('2025-01-01')
  const [date2, setDate2] = useState('2025-12-31')
  const [startDate, setStartDate] = useState('2025-01-01')
  const [addDays, setAddDays] = useState('90')
  const [direction, setDirection] = useState<'add' | 'subtract'>('add')

  const diff = useMemo(() => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null
    const ms = Math.abs(d2.getTime() - d1.getTime())
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30.44)
    const years = Math.floor(days / 365.25)
    const hours = days * 24
    const minutes = hours * 60
    const weekdays = Array.from({ length: days }, (_, i) => {
      const d = new Date(Math.min(d1.getTime(), d2.getTime()) + i * 86400000)
      return d.getDay()
    }).filter((d) => d !== 0 && d !== 6).length
    return { days, weeks, months, years, hours, minutes, weekdays }
  }, [date1, date2])

  const resultDate = useMemo(() => {
    const d = new Date(startDate)
    if (isNaN(d.getTime())) return null
    const n = parseInt(addDays) || 0
    if (direction === 'add') d.setDate(d.getDate() + n)
    else d.setDate(d.getDate() - n)
    return d
  }, [startDate, addDays, direction])

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="diff" className="flex-1">📅 Days Between</TabsTrigger>
          <TabsTrigger value="add" className="flex-1">➕ Add / Subtract</TabsTrigger>
        </TabsList>

        <TabsContent value="diff">
          <Card className="glass border-none shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} />
              </div>

              {diff && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Days', value: diff.days },
                    { label: 'Weekdays', value: diff.weekdays },
                    { label: 'Weeks', value: diff.weeks },
                    { label: 'Months', value: diff.months },
                    { label: 'Years', value: diff.years },
                    { label: 'Hours', value: diff.hours.toLocaleString() },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => copy(item.value.toString())}
                      className="p-3 rounded-xl bg-accent/50 hover:bg-accent transition-all text-center"
                    >
                      <p className="text-xl font-bold">{item.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card className="glass border-none shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Days</Label>
                  <Input type="number" value={addDays} onChange={(e) => setAddDays(e.target.value)} />
                </div>
                <div className="flex gap-1 pb-1">
                  <Button
                    size="sm"
                    variant={direction === 'add' ? 'default' : 'outline'}
                    onClick={() => setDirection('add')}
                  >
                    + Add
                  </Button>
                  <Button
                    size="sm"
                    variant={direction === 'subtract' ? 'default' : 'outline'}
                    onClick={() => setDirection('subtract')}
                  >
                    - Subtract
                  </Button>
                </div>
              </div>

              {resultDate && (
                <div
                  className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center cursor-pointer"
                  onClick={() => copy(resultDate.toDateString())}
                >
                  <p className="text-xs opacity-80">Result</p>
                  <p className="text-lg font-bold">{resultDate.toDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
