import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-15')
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().slice(0, 10))

  const age = useMemo(() => {
    const birth = new Date(birthDate)
    const asOf = new Date(asOfDate)
    if (isNaN(birth.getTime()) || isNaN(asOf.getTime())) return null

    let years = asOf.getFullYear() - birth.getFullYear()
    let months = asOf.getMonth() - birth.getMonth()
    let days = asOf.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor((asOf.getTime() - birth.getTime()) / (1000 * 60 * 60))
    const nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < asOf) nextBirthday.setFullYear(asOf.getFullYear() + 1)
    const daysUntilNext = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24))

    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate())
    const birthstone = getBirthstone(birth.getMonth() + 1)

    return { years, months, days, totalDays, totalHours, daysUntilNext, zodiac, birthstone }
  }, [birthDate, asOfDate])

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
            </div>
          </div>

          {age && (
            <div className="space-y-3">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <p className="text-5xl font-bold">
                  {age.years}
                </p>
                <p className="text-lg opacity-90 mt-1">
                  {age.years} years, {age.months} months, {age.days} days old
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-accent/50 text-center">
                  <p className="text-2xl font-bold">{age.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 text-center">
                  <p className="text-2xl font-bold">{age.totalHours.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Hours</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 text-center">
                  <p className="text-2xl font-bold">{age.daysUntilNext}</p>
                  <p className="text-xs text-muted-foreground">Days Until Next Birthday</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 text-center">
                  <p className="text-xl font-bold">{age.zodiac}</p>
                  <p className="text-xs text-muted-foreground">Zodiac Sign</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getZodiac(month: number, day: number): string {
  const signs = [
    { name: '♑ Capricorn', start: [1, 1], end: [1, 19] },
    { name: '♒ Aquarius', start: [1, 20], end: [2, 18] },
    { name: '♓ Pisces', start: [2, 19], end: [3, 20] },
    { name: '♈ Aries', start: [3, 21], end: [4, 19] },
    { name: '♉ Taurus', start: [4, 20], end: [5, 20] },
    { name: '♊ Gemini', start: [5, 21], end: [6, 20] },
    { name: '♋ Cancer', start: [6, 21], end: [7, 22] },
    { name: '♌ Leo', start: [7, 23], end: [8, 22] },
    { name: '♍ Virgo', start: [8, 23], end: [9, 22] },
    { name: '♎ Libra', start: [9, 23], end: [10, 22] },
    { name: '♏ Scorpio', start: [10, 23], end: [11, 21] },
    { name: '♐ Sagittarius', start: [11, 22], end: [12, 21] },
    { name: '♑ Capricorn', start: [12, 22], end: [12, 31] },
  ]
  const dateNum = month * 100 + day
  for (const s of signs) {
    const start = s.start[0] * 100 + s.start[1]
    const end = s.end[0] * 100 + s.end[1]
    if (dateNum >= start && dateNum <= end) return s.name
  }
  return 'Unknown'
}

function getBirthstone(month: number): string {
  const stones = ['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl',
    'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise']
  return stones[month - 1] || ''
}
