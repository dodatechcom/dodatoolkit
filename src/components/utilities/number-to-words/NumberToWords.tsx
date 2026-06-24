import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function convertHundreds(n: number): string {
  const parts: string[] = []
  if (n >= 100) {
    parts.push(ONES[Math.floor(n / 100)] + ' hundred')
    n %= 100
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)])
    n %= 10
  }
  if (n > 0) {
    parts.push(ONES[n])
  }
  return parts.join(' ') || 'zero'
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero'
  if (num < 0) return 'minus ' + numberToWords(-num)

  const BILLION = 1000000000
  const MILLION = 1000000
  const THOUSAND = 1000

  const parts: string[] = []
  let n = Math.floor(num)

  if (n >= BILLION) {
    parts.push(convertHundreds(Math.floor(n / BILLION)) + ' billion')
    n %= BILLION
  }
  if (n >= MILLION) {
    parts.push(convertHundreds(Math.floor(n / MILLION)) + ' million')
    n %= MILLION
  }
  if (n >= THOUSAND) {
    parts.push(convertHundreds(Math.floor(n / THOUSAND)) + ' thousand')
    n %= THOUSAND
  }
  if (n > 0) {
    parts.push(convertHundreds(n))
  }

  return parts.join(' ')
}

export function NumberToWords() {
  const [input, setInput] = useState('1234567')
  const [currency, setCurrency] = useState(false)

  const result = useMemo(() => {
    const num = parseFloat(input)
    if (isNaN(num)) return ''
    if (!currency) return numberToWords(num)
    const dollars = Math.floor(num)
    const cents = Math.round((num - dollars) * 100)
    let words = numberToWords(dollars) + ' dollars'
    if (cents > 0) words += ' and ' + numberToWords(cents) + ' cents'
    else words += ' and zero cents'
    return words
  }, [input, currency])

  function copy() {
    navigator.clipboard.writeText(result).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Enter Number</Label>
            <Input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-lg font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency(!currency)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currency ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}
            >
              💰 Currency Format
            </button>
          </div>
          {result && (
            <div
              className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white cursor-pointer"
              onClick={copy}
            >
              <p className="text-xs opacity-80 mb-1">
                {currency ? 'Amount in words' : 'Number in words'} (click to copy)
              </p>
              <p className="text-lg font-medium capitalize leading-relaxed">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
