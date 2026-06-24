import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function BaseConverter() {
  const [dec, setDec] = useState('255')
  const [hex, setHex] = useState('ff')
  const [bin, setBin] = useState('11111111')
  const [oct, setOct] = useState('377')
  const [activeInput, setActiveInput] = useState<'dec' | 'hex' | 'bin' | 'oct'>('dec')

  const values = useMemo(() => {
    let num: number | null = null
    switch (activeInput) {
      case 'dec': num = parseInt(dec); break
      case 'hex': num = parseInt(hex, 16); break
      case 'bin': num = parseInt(bin, 2); break
      case 'oct': num = parseInt(oct, 8); break
    }
    if (num === null || isNaN(num)) {
      return { dec: '', hex: '', bin: '', oct: '' }
    }
    return {
      dec: num.toString(10),
      hex: num.toString(16).toLowerCase(),
      bin: num.toString(2),
      oct: num.toString(8),
    }
  }, [dec, hex, bin, oct, activeInput])

  function handleChange(type: 'dec' | 'hex' | 'bin' | 'oct', value: string) {
    setActiveInput(type)
    const cleaned = type === 'hex' ? value.replace(/[^0-9a-fA-F]/g, '') :
                    type === 'bin' ? value.replace(/[^01]/g, '') :
                    type === 'oct' ? value.replace(/[^0-7]/g, '') :
                    value.replace(/[^0-9]/g, '')
    switch (type) {
      case 'dec': setDec(cleaned); break
      case 'hex': setHex(cleaned); break
      case 'bin': setBin(cleaned); break
      case 'oct': setOct(cleaned); break
    }
  }

  const fields = [
    { type: 'dec' as const, label: 'Decimal', value: values.dec, prefix: '', emoji: '🔟' },
    { type: 'hex' as const, label: 'Hexadecimal', value: values.hex, prefix: '0x', emoji: '🔢' },
    { type: 'bin' as const, label: 'Binary', value: values.bin, prefix: '0b', emoji: '💻' },
    { type: 'oct' as const, label: 'Octal', value: values.oct, prefix: '0o', emoji: '🔮' },
  ]

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success(`${label} copied!`)
  }

  return (
    <div className="max-w-lg space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.type} className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <span>{field.emoji}</span>
                <span>{field.label}</span>
                {field.value && (
                  <Badge
                    variant="outline"
                    className="ml-auto cursor-pointer"
                    onClick={() => copy(field.value, field.label)}
                  >
                    📋
                  </Badge>
                )}
              </Label>
              <div className="flex items-center gap-2">
                {field.prefix && (
                  <span className="text-sm font-mono text-muted-foreground shrink-0">{field.prefix}</span>
                )}
                <Input
                  value={
                    field.type === 'dec' ? dec :
                    field.type === 'hex' ? hex :
                    field.type === 'bin' ? bin :
                    oct
                  }
                  onChange={(e) => handleChange(field.type, e.target.value)}
                  className="font-mono"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              </div>
              {field.value && (
                <p className="text-xs text-muted-foreground font-mono">
                  = {field.prefix}{field.value}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
