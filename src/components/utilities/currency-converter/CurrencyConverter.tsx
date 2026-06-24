import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const fallbackUsdRates: Record<string, number> = {
  EUR: 0.92, GBP: 0.79, JPY: 157.5, INR: 83.2, CAD: 1.36, AUD: 1.53, CNY: 7.25, BRL: 5.05, KRW: 1320,
}

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CNY', 'BRL', 'KRW']

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [usdRates, setUsdRates] = useState<Record<string, number>>(fallbackUsdRates)
  const [lastUpdated, setLastUpdated] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)

  const fetchRates = useCallback(async (showToast = false) => {
    setLoading(true)
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD')
      const data = await res.json()
      if (data?.rates) {
        const m: Record<string, number> = {}
        for (const c of currencies) {
          if (c === 'USD') continue
          if (data.rates[c] != null) m[c] = data.rates[c]
        }
        setUsdRates(m)
        setIsLive(true)
        setLastUpdated(new Date().toLocaleString())
        if (showToast) toast.success('Rates updated live')
      } else {
        throw new Error('Invalid response')
      }
    } catch {
      if (showToast) toast('Using cached rates', { icon: '📦' })
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchRates() }, [fetchRates])

  const numAmount = parseFloat(amount) || 0
  const rate = from === to ? 1 : usdRates[to] / usdRates[from]
  const result = numAmount * rate

  const swap = () => { setFrom(to); setTo(from) }

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

      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant={isLive ? 'default' : 'secondary'}>
          {isLive ? '🔴 Live' : '📦 Offline'} 1 {from} = {rate.toFixed(4)} {to}
        </Badge>
        <Button onClick={() => fetchRates(true)} disabled={loading} variant="ghost" size="sm">
          {loading ? '⏳' : '🔄'} Refresh
        </Button>
        {lastUpdated && <span className="text-[10px] text-muted-foreground">{lastUpdated}</span>}
      </div>
    </div>
  )
}
