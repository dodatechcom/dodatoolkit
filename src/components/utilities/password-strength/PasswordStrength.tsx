import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function calculateStrength(pw: string): { score: number; label: string; color: string; time: string } {
  let score = 0
  if (pw.length >= 8) score++; if (pw.length >= 12) score++; if (pw.length >= 16) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (pw.length >= 20) score++

  const entropy = pw.length * (Math.log2(
    (/[a-z]/.test(pw) ? 26 : 0) +
    (/[A-Z]/.test(pw) ? 26 : 0) +
    (/\d/.test(pw) ? 10 : 0) +
    (/[^a-zA-Z0-9]/.test(pw) ? 32 : 0) +
    1
  ) || 1)

  const guesses = Math.pow(2, entropy)
  const rate = 1e9
  const seconds = guesses / rate
  const time = seconds < 1 ? 'Instant' : seconds < 60 ? `${Math.round(seconds)}s` : seconds < 3600 ? `${Math.round(seconds / 60)}min` : seconds < 86400 ? `${Math.round(seconds / 3600)}h` : seconds < 2592000 ? `${Math.round(seconds / 86400)}d` : seconds < 31536000 ? `${Math.round(seconds / 2592000)}mo` : `${(seconds / 31536000).toFixed(1)}yr`

  const levels = [
    { max: 2, label: 'Weak', color: 'bg-red-500' },
    { max: 3, label: 'Fair', color: 'bg-orange-500' },
    { max: 4, label: 'Good', color: 'bg-yellow-500' },
    { max: 5, label: 'Strong', color: 'bg-lime-500' },
    { max: 6, label: 'Very Strong', color: 'bg-green-500' },
    { max: 7, label: 'Unbreakable', color: 'bg-emerald-500' },
  ]
  const level = levels.find(l => score <= l.max) || levels[levels.length - 1]

  return { score, label: level.label, color: level.color, time }
}

export function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  const strength = useMemo(() => calculateStrength(password), [password])

  const pct = (strength.score / 7) * 100

  const genRandom = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='
    let p = ''
    for (let i = 0; i < 20; i++) p += chars[Math.floor(Math.random() * chars.length)]
    setPassword(p)
    toast.success('Password generated')
  }

  const copy = () => { navigator.clipboard.writeText(password).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="relative">
        <Input type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Type a password..." className="font-mono text-lg pr-20" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button onClick={() => setVisible(v => !v)} className="text-sm text-muted-foreground hover:text-foreground">{visible ? '🙈' : '👁️'}</button>
          {password && <button onClick={copy} className="text-sm text-muted-foreground hover:text-foreground">📋</button>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={genRandom} className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium">🎲 Generate Strong</button>
      </div>

      {password && (
        <div className="space-y-4">
          <div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm font-medium">{strength.label}</span>
              <span className="text-xs text-muted-foreground">Crack time: {strength.time}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Length', ok: password.length >= 8, detail: `${password.length} chars` },
              { label: 'Uppercase + Lowercase', ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
              { label: 'Numbers', ok: /\d/.test(password) },
              { label: 'Symbols', ok: /[^a-zA-Z0-9]/.test(password) },
            ].map(c => (
              <div key={c.label} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${c.ok ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                <span>{c.ok ? '✅' : '❌'}</span>
                <span>{c.label}</span>
                {c.detail && <span className="text-xs">({c.detail})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!password && (
        <div className="text-center text-muted-foreground text-sm py-8">
          Type or generate a password to check its strength
        </div>
      )}
    </div>
  )
}
