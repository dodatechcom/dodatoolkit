import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const signs = [
  { name: 'Aries', emoji: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire', planet: 'Mars' },
  { name: 'Taurus', emoji: '♉', dates: 'Apr 20 – May 20', element: 'Earth', planet: 'Venus' },
  { name: 'Gemini', emoji: '♊', dates: 'May 21 – Jun 20', element: 'Air', planet: 'Mercury' },
  { name: 'Cancer', emoji: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', planet: 'Moon' },
  { name: 'Leo', emoji: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire', planet: 'Sun' },
  { name: 'Virgo', emoji: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', planet: 'Mercury' },
  { name: 'Libra', emoji: '♎', dates: 'Sep 23 – Oct 22', element: 'Air', planet: 'Venus' },
  { name: 'Scorpio', emoji: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', planet: 'Pluto' },
  { name: 'Sagittarius', emoji: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire', planet: 'Jupiter' },
  { name: 'Capricorn', emoji: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', planet: 'Saturn' },
  { name: 'Aquarius', emoji: '♒', dates: 'Jan 20 – Feb 18', element: 'Air', planet: 'Uranus' },
  { name: 'Pisces', emoji: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', planet: 'Neptune' },
]

const compatibility: Record<string, Record<string, number>> = {}
for (const a of signs) {
  compatibility[a.name] = {}
  for (const b of signs) {
    if (a.name === b.name) { compatibility[a.name][b.name] = 100; continue }
    const sameElement = a.element === b.element
    const airWater = (a.element === 'Air' && b.element === 'Water') || (a.element === 'Water' && b.element === 'Air')
    const fireEarth = (a.element === 'Fire' && b.element === 'Earth') || (a.element === 'Earth' && b.element === 'Fire')
    const score = sameElement ? 85 + Math.floor(Math.random() * 10) : airWater ? 65 + Math.floor(Math.random() * 10) : fireEarth ? 50 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 20)
    compatibility[a.name][b.name] = Math.min(99, score)
  }
}

export function Zodiac() {
  const [sign1, setSign1] = useState(signs[0].name)
  const [sign2, setSign2] = useState(signs[4].name)

  const s1 = signs.find(s => s.name === sign1)!
  const s2 = signs.find(s => s.name === sign2)!
  const score = compatibility[sign1]?.[sign2] || 50

  const level = score >= 80 ? 'High' : score >= 65 ? 'Medium' : 'Low'
  const color = score >= 80 ? 'bg-green-100 dark:bg-green-900/20 border-green-300 text-green-700' :
    score >= 65 ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 text-yellow-700' :
    'bg-red-100 dark:bg-red-900/20 border-red-300 text-red-700'

  const copy = () => {
    navigator.clipboard.writeText(`${s1.emoji} ${sign1} + ${s2.emoji} ${sign2} = ${score}% (${level} compatibility)`).catch(() => {})
    toast.success('Copied')
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Sign 1</Label>
          <select value={sign1} onChange={e => setSign1(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            {signs.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
          </select>
          <div className="text-xs text-muted-foreground mt-1">{s1.dates} · {s1.element} · {s1.planet}</div>
        </div>
        <div>
          <Label>Sign 2</Label>
          <select value={sign2} onChange={e => setSign2(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            {signs.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
          </select>
          <div className="text-xs text-muted-foreground mt-1">{s2.dates} · {s2.element} · {s2.planet}</div>
        </div>
      </div>

      <Card className={`text-center ${color}`}>
        <CardContent className="p-6">
          <div className="text-4xl mb-2">{s1.emoji} 💞 {s2.emoji}</div>
          <div className="text-5xl font-bold font-mono">{score}%</div>
          <div className="text-lg font-medium mt-1 capitalize">{level} Compatibility</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <Card className="bg-white/40 dark:bg-white/5">
          <CardContent className="p-3">
            <div className="text-xl">{s1.element === s2.element ? '✅' : '❌'}</div>
            <div className="text-xs text-muted-foreground">Same Element</div>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-white/5">
          <CardContent className="p-3">
            <div className="text-xl">{s1.planet === s2.planet ? '✅' : '❌'}</div>
            <div className="text-xs text-muted-foreground">Same Planet</div>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-white/5">
          <CardContent className="p-3">
            <div className="text-xl">{['Fire', 'Water', 'Earth', 'Air'].indexOf(s1.element) % 2 === ['Fire', 'Water', 'Earth', 'Air'].indexOf(s2.element) % 2 ? '✅' : '❌'}</div>
            <div className="text-xs text-muted-foreground">Harmonious</div>
          </CardContent>
        </Card>
      </div>

      <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground block mx-auto">📋 Copy Result</button>
    </div>
  )
}
