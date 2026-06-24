import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import toast from 'react-hot-toast'

export function PercentageCalc() {
  const [tab, setTab] = useState('what-is')
  const [p1, setP1] = useState('20')
  const [p2, setP2] = useState('200')
  const [f1, setF1] = useState('50')
  const [f2, setF2] = useState('200')
  const [c1, setC1] = useState('100')
  const [c2, setC2] = useState('20')
  const [c3, setC3] = useState('add')

  const pResult = useMemo(() => (parseFloat(p1) / 100) * parseFloat(p2), [p1, p2])

  const fResult = useMemo(() => {
    const a = parseFloat(f1)
    const b = parseFloat(f2)
    if (!a || !b) return 0
    return (a / b) * 100
  }, [f1, f2])

  const cResult = useMemo(() => {
    const base = parseFloat(c1)
    const pct = parseFloat(c2)
    if (isNaN(base) || isNaN(pct)) return 0
    if (c3 === 'add') return base + (base * pct / 100)
    return base - (base * pct / 100)
  }, [c1, c2, c3])

  function copy(v: string) {
    navigator.clipboard.writeText(v).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-lg space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="what-is" className="flex-1">What is X% of Y?</TabsTrigger>
          <TabsTrigger value="fraction" className="flex-1">X is what % of Y?</TabsTrigger>
          <TabsTrigger value="change" className="flex-1">Add / Subtract %</TabsTrigger>
        </TabsList>

        <TabsContent value="what-is">
          <Card className="glass border-none shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Percent (%)</Label>
                  <Input type="number" value={p1} onChange={(e) => setP1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Of Number</Label>
                  <Input type="number" value={p2} onChange={(e) => setP2(e.target.value)} />
                </div>
              </div>
              {!isNaN(pResult) && (
                <div
                  className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center cursor-pointer"
                  onClick={() => copy(pResult.toString())}
                >
                  <p className="text-xs opacity-80">Result</p>
                  <p className="text-2xl font-bold">{pResult.toLocaleString()}</p>
                  <p className="text-sm opacity-90">{p1}% of {parseFloat(p2).toLocaleString()} = {pResult.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraction">
          <Card className="glass border-none shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>X (part)</Label>
                  <Input type="number" value={f1} onChange={(e) => setF1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Y (total)</Label>
                  <Input type="number" value={f2} onChange={(e) => setF2(e.target.value)} />
                </div>
              </div>
              {!isNaN(fResult) && (
                <div
                  className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center cursor-pointer"
                  onClick={() => copy(fResult.toFixed(2) + '%')}
                >
                  <p className="text-xs opacity-80">Result</p>
                  <p className="text-2xl font-bold">{fResult.toFixed(2)}%</p>
                  <p className="text-sm opacity-90">{parseFloat(f1).toLocaleString()} is {fResult.toFixed(2)}% of {parseFloat(f2).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change">
          <Card className="glass border-none shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Base Number</Label>
                  <Input type="number" value={c1} onChange={(e) => setC1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Percent</Label>
                  <Input type="number" value={c2} onChange={(e) => setC2(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setC3('add')}
                  className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${c3 === 'add' ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}
                >
                  + Add
                </button>
                <button
                  onClick={() => setC3('subtract')}
                  className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${c3 === 'subtract' ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}
                >
                  - Subtract
                </button>
              </div>
              {!isNaN(cResult) && (
                <div
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-center cursor-pointer"
                  onClick={() => copy(cResult.toString())}
                >
                  <p className="text-xs opacity-80">Result</p>
                  <p className="text-2xl font-bold">{cResult.toLocaleString()}</p>
                  <p className="text-sm opacity-90">
                    {c3 === 'add' ? '+' : '-'}{c2}% of {parseFloat(c1).toLocaleString()} = {cResult.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
