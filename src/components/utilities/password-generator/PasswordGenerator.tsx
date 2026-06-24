import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useDigits: boolean, useSymbols: boolean): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  let chars = ''
  if (useUpper) chars += upper
  if (useLower) chars += lower
  if (useDigits) chars += digits
  if (useSymbols) chars += symbols
  if (!chars) return ''

  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}

function estimateStrength(password: string): { label: string; color: string; score: number } {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  if (password.length >= 20) score += 1

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', score }
  if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', score }
  if (score <= 5) return { label: 'Strong', color: 'bg-emerald-500', score }
  return { label: 'Very Strong', color: 'bg-green-600', score }
}

export function PasswordGenerator() {
  const [length, setLength] = useState('20')
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const generate = useCallback(() => {
    const len = Math.max(4, Math.min(128, parseInt(length) || 12))
    const pwd = generatePassword(len, useUpper, useLower, useDigits, useSymbols)
    setPassword(pwd)
    setHistory((prev) => [pwd, ...prev].slice(0, 10))
  }, [length, useUpper, useLower, useDigits, useSymbols])

  const strength = password ? estimateStrength(password) : null

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Length: {length}</Label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4</span><span>128</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
              <span className="text-sm">A-Z</span>
              <Switch checked={useUpper} onCheckedChange={setUseUpper} />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
              <span className="text-sm">a-z</span>
              <Switch checked={useLower} onCheckedChange={setUseLower} />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
              <span className="text-sm">0-9</span>
              <Switch checked={useDigits} onCheckedChange={setUseDigits} />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
              <span className="text-sm">!@#$%</span>
              <Switch checked={useSymbols} onCheckedChange={setUseSymbols} />
            </label>
          </div>

          <Button onClick={generate} variant="glass" className="w-full" size="lg">
            🔐 Generate Password
          </Button>
        </CardContent>
      </Card>

      {password && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-base p-3 flex-1 truncate" title={password}>
                {password}
              </Badge>
              <Button onClick={() => copy(password)} variant="ghost" size="icon">📋</Button>
              <Button onClick={generate} variant="ghost" size="icon">🔄</Button>
            </div>
            {strength && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 7) * 100}%` }} />
                </div>
                <span className="text-xs font-medium">{strength.label}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {history.length > 1 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">History (last 10)</p>
            {history.slice(1).map((pwd, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => copy(pwd)}
              >
                <code className="flex-1 font-mono text-sm truncate">{pwd}</code>
                <span className="opacity-0 group-hover:opacity-100 text-xs">📋</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
