import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const elements = [
  { n: 1, sym: 'H', name: 'Hydrogen', mass: 1.008, cat: 'nonmetal', row: 1, col: 1 },
  { n: 2, sym: 'He', name: 'Helium', mass: 4.003, cat: 'noble', row: 1, col: 18 },
  { n: 3, sym: 'Li', name: 'Lithium', mass: 6.941, cat: 'alkali', row: 2, col: 1 },
  { n: 4, sym: 'Be', name: 'Beryllium', mass: 9.012, cat: 'alkaline', row: 2, col: 2 },
  { n: 5, sym: 'B', name: 'Boron', mass: 10.811, cat: 'metalloid', row: 2, col: 13 },
  { n: 6, sym: 'C', name: 'Carbon', mass: 12.011, cat: 'nonmetal', row: 2, col: 14 },
  { n: 7, sym: 'N', name: 'Nitrogen', mass: 14.007, cat: 'nonmetal', row: 2, col: 15 },
  { n: 8, sym: 'O', name: 'Oxygen', mass: 15.999, cat: 'nonmetal', row: 2, col: 16 },
  { n: 9, sym: 'F', name: 'Fluorine', mass: 18.998, cat: 'halogen', row: 2, col: 17 },
  { n: 10, sym: 'Ne', name: 'Neon', mass: 20.180, cat: 'noble', row: 2, col: 18 },
  { n: 11, sym: 'Na', name: 'Sodium', mass: 22.990, cat: 'alkali', row: 3, col: 1 },
  { n: 12, sym: 'Mg', name: 'Magnesium', mass: 24.305, cat: 'alkaline', row: 3, col: 2 },
  { n: 13, sym: 'Al', name: 'Aluminium', mass: 26.982, cat: 'metal', row: 3, col: 13 },
  { n: 14, sym: 'Si', name: 'Silicon', mass: 28.086, cat: 'metalloid', row: 3, col: 14 },
  { n: 15, sym: 'P', name: 'Phosphorus', mass: 30.974, cat: 'nonmetal', row: 3, col: 15 },
  { n: 16, sym: 'S', name: 'Sulfur', mass: 32.065, cat: 'nonmetal', row: 3, col: 16 },
  { n: 17, sym: 'Cl', name: 'Chlorine', mass: 35.453, cat: 'halogen', row: 3, col: 17 },
  { n: 18, sym: 'Ar', name: 'Argon', mass: 39.948, cat: 'noble', row: 3, col: 18 },
  { n: 19, sym: 'K', name: 'Potassium', mass: 39.098, cat: 'alkali', row: 4, col: 1 },
  { n: 20, sym: 'Ca', name: 'Calcium', mass: 40.078, cat: 'alkaline', row: 4, col: 2 },
  { n: 26, sym: 'Fe', name: 'Iron', mass: 55.845, cat: 'metal', row: 4, col: 8 },
  { n: 29, sym: 'Cu', name: 'Copper', mass: 63.546, cat: 'metal', row: 4, col: 11 },
  { n: 47, sym: 'Ag', name: 'Silver', mass: 107.868, cat: 'metal', row: 5, col: 11 },
  { n: 79, sym: 'Au', name: 'Gold', mass: 196.967, cat: 'metal', row: 6, col: 11 },
]

const catColors: Record<string, string> = {
  nonmetal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  noble: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  alkali: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  alkaline: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  metalloid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  halogen: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  metal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

export function PeriodicTable() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof elements[0] | null>(null)

  const filtered = useMemo(() => {
    if (!search) return elements
    const q = search.toLowerCase()
    return elements.filter(e => e.sym.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.n.toString().includes(q))
  }, [search])

  const copy = (v: string) => { navigator.clipboard.writeText(v).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, symbol, or number..." className="max-w-md" />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1.5">
        {filtered.map(e => {
          const catColor = catColors[e.cat] || ''
          const isSelected = selected?.n === e.n
          return (
            <button key={e.n} onClick={() => setSelected(e)}
              className={`p-1.5 rounded-lg border text-center text-xs transition-all hover:scale-110 ${catColor} ${isSelected ? 'ring-2 ring-indigo-500 scale-110' : ''}`}>
              <div className="font-bold text-sm">{e.sym}</div>
              <div className="text-[9px] opacity-70">{e.n}</div>
            </button>
          )
        })}
      </div>

      {selected && (
        <Card className={`${catColors[selected.cat] || ''}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{selected.sym} — {selected.name}</div>
              <div className="text-sm mt-1">#{selected.n} · {selected.mass} g/mol · {selected.cat}</div>
            </div>
            <button onClick={() => copy(`${selected.sym} - ${selected.name} (${selected.n})`)} className="text-xl">📋</button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
