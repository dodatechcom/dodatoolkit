import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function emi(P: number, r: number, n: number): number {
  if (r === 0) return P / n
  const mr = r / 12 / 100
  return P * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1)
}

export function EmiCalculator() {
  const [amount, setAmount] = useState('500000')
  const [rate, setRate] = useState('8.5')
  const [years, setYears] = useState('5')

  const P = parseFloat(amount) || 0
  const annualRate = parseFloat(rate) || 0
  const n = (parseFloat(years) || 0) * 12

  const monthly = useMemo(() => emi(P, annualRate, n), [P, annualRate, n])
  const totalPayment = monthly * n
  const totalInterest = totalPayment - P

  const formatNum = (v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 2 })

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-3">
        <div>
          <Label>Loan Amount (₹)</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-lg font-mono" min={0} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="text-lg font-mono" min={0} step={0.1} />
          </div>
          <div>
            <Label>Tenure (Years)</Label>
            <Input type="number" value={years} onChange={e => setYears(e.target.value)} className="text-lg font-mono" min={0} step={0.5} />
          </div>
        </div>
      </div>

      {P > 0 && n > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Monthly EMI</p>
              <p className="text-2xl font-bold text-primary">₹{formatNum(monthly)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="text-xl font-semibold">₹{formatNum(totalInterest)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Payment</p>
              <p className="text-xl font-semibold">₹{formatNum(totalPayment)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {P === 0 && (
        <div className="text-center text-muted-foreground py-8 text-sm">
          Enter loan details to calculate EMI
        </div>
      )}
    </div>
  )
}
