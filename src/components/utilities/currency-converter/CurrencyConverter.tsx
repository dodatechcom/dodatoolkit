import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const rates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 157.5, INR: 83.2, CAD: 1.36, AUD: 1.53, CNY: 7.25, BRL: 5.05, KRW: 1320 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 171.2, INR: 90.5, CAD: 1.48, AUD: 1.66, CNY: 7.88, BRL: 5.49, KRW: 1435 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 199.1, INR: 105.3, CAD: 1.72, AUD: 1.93, CNY: 9.17, BRL: 6.39, KRW: 1670 },
  JPY: { USD: 0.0064, EUR: 0.0058, GBP: 0.0050, INR: 0.53, CAD: 0.0086, AUD: 0.0097, CNY: 0.046, BRL: 0.032, KRW: 8.38 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.89, CAD: 0.016, AUD: 0.018, CNY: 0.087, BRL: 0.061, KRW: 15.9 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 116.0, INR: 61.5, AUD: 1.13, CNY: 5.35, BRL: 3.73, KRW: 972 },
  AUD: { USD: 0.65, EUR: 0.60, GBP: 0.52, JPY: 103.0, INR: 54.5, CAD: 0.89, CNY: 4.73, BRL: 3.30, KRW: 860 },
  CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 21.8, INR: 11.5, CAD: 0.19, AUD: 0.21, BRL: 0.70, KRW: 182 },
  BRL: { USD: 0.20, EUR: 0.18, GBP: 0.16, JPY: 31.1, INR: 16.5, CAD: 0.27, AUD: 0.30, CNY: 1.43, KRW: 261 },
  KRW: { USD: 0.00076, EUR: 0.00070, GBP: 0.00060, JPY: 0.12, INR: 0.063, CAD: 0.0010, AUD: 0.0012, CNY: 0.0055, BRL: 0.0038 },
}

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CNY', 'BRL', 'KRW']

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [lastUpdated, setLastUpdated] = useState('')

  const numAmount = parseFloat(amount) || 0
  const rate = from === to ? 1 : (rates[from]?.[to] ?? 0)
  const result = numAmount * rate

  const refresh = async () => {
    toast('Using offline rates. Add API key for live rates.', { icon: 'ℹ️' })
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-lg font-mono" min={0} />
        </div>
        <Select value={from} onChange={e => setFrom(e.target.value)} options={currencies.map(c => ({ value: c, label: c }))} className="w-24" />
      </div>

      <div className="flex justify-center">
        <button onClick={swap} className="p-2 rounded-lg hover:bg-secondary transition-colors text-lg">⇅</button>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Converted</Label>
          <Input value={result.toFixed(2)} readOnly className="text-lg font-mono text-primary font-bold" />
        </div>
        <Select value={to} onChange={e => setTo(e.target.value)} options={currencies.map(c => ({ value: c, label: c }))} className="w-24" />
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary">1 {from} = {rate.toFixed(4)} {to}</Badge>
        <Button onClick={refresh} variant="ghost" size="sm">🔄 Refresh Rates</Button>
      </div>
    </div>
  )
}
