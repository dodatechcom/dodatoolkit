import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import toast from 'react-hot-toast'

interface UnitCategory {
  id: string
  name: string
  emoji: string
  units: { value: string; label: string }[]
  convert: (value: number, from: string, to: string) => number
}

const categories: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    emoji: '📏',
    units: [
      { value: 'mm', label: 'Millimeter (mm)' },
      { value: 'cm', label: 'Centimeter (cm)' },
      { value: 'm', label: 'Meter (m)' },
      { value: 'km', label: 'Kilometer (km)' },
      { value: 'in', label: 'Inch (in)' },
      { value: 'ft', label: 'Foot (ft)' },
      { value: 'yd', label: 'Yard (yd)' },
      { value: 'mi', label: 'Mile (mi)' },
    ],
    convert(value, from, to) {
      const toMeter: Record<string, number> = {
        mm: 0.001, cm: 0.01, m: 1, km: 1000,
        in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
      }
      return (value * toMeter[from]) / toMeter[to]
    },
  },
  {
    id: 'weight',
    name: 'Weight',
    emoji: '⚖️',
    units: [
      { value: 'mg', label: 'Milligram (mg)' },
      { value: 'g', label: 'Gram (g)' },
      { value: 'kg', label: 'Kilogram (kg)' },
      { value: 'oz', label: 'Ounce (oz)' },
      { value: 'lb', label: 'Pound (lb)' },
      { value: 'st', label: 'Stone (st)' },
    ],
    convert(value, from, to) {
      const toGram: Record<string, number> = {
        mg: 0.001, g: 1, kg: 1000,
        oz: 28.3495, lb: 453.592, st: 6350.29,
      }
      return (value * toGram[from]) / toGram[to]
    },
  },
  {
    id: 'temperature',
    name: 'Temperature',
    emoji: '🌡️',
    units: [
      { value: 'c', label: 'Celsius (°C)' },
      { value: 'f', label: 'Fahrenheit (°F)' },
      { value: 'k', label: 'Kelvin (K)' },
    ],
    convert(value, from, to) {
      let celsius: number
      if (from === 'c') celsius = value
      else if (from === 'f') celsius = (value - 32) * 5 / 9
      else celsius = value - 273.15

      if (to === 'c') return celsius
      if (to === 'f') return celsius * 9 / 5 + 32
      return celsius + 273.15
    },
  },
  {
    id: 'data',
    name: 'Data Size',
    emoji: '💾',
    units: [
      { value: 'b', label: 'Byte (B)' },
      { value: 'kb', label: 'Kilobyte (KB)' },
      { value: 'mb', label: 'Megabyte (MB)' },
      { value: 'gb', label: 'Gigabyte (GB)' },
      { value: 'tb', label: 'Terabyte (TB)' },
    ],
    convert(value, from, to) {
      const toByte: Record<string, number> = {
        b: 1, kb: 1024, mb: 1024 ** 2,
        gb: 1024 ** 3, tb: 1024 ** 4,
      }
      return (value * toByte[from]) / toByte[to]
    },
  },
]

export function UnitConverter() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [value, setValue] = useState('100')
  const [fromInput, setFromInput] = useState('100')

  const currentCat = useMemo(() => categories.find((c) => c.id === category)!, [category])

  const result = useMemo(() => {
    const v = parseFloat(fromInput)
    if (isNaN(v)) return ''
    return currentCat.convert(v, fromUnit, toUnit).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })
  }, [fromInput, fromUnit, toUnit, currentCat])

  function handleCategoryChange(newCat: string) {
    const cat = categories.find((c) => c.id === newCat)!
    setCategory(newCat)
    setFromUnit(cat.units[0].value)
    setToUnit(cat.units[1]?.value ?? cat.units[0].value)
  }

  function swap() {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  function copyResult() {
    navigator.clipboard.writeText(value).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6">
          <Tabs value={category} onValueChange={handleCategoryChange}>
            <TabsList className="mb-4">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="number"
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                  />
                  <Select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    options={currentCat.units}
                  />
                </div>
                <div className="pb-2">
                  <button
                    onClick={swap}
                    className="mt-8 p-2 rounded-xl hover:bg-accent transition-colors text-lg"
                  >
                    🔄
                  </button>
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    type="text"
                    value={result}
                    readOnly
                    className="font-semibold text-primary"
                  />
                  <Select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    options={currentCat.units}
                  />
                </div>
              </div>
              <button
                onClick={copyResult}
                className="w-full p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors text-sm text-center"
              >
                📋 Copy result: {fromInput} {fromUnit} = {result} {toUnit}
              </button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
