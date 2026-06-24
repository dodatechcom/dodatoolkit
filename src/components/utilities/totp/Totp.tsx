import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

async function totp(secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret.padEnd(8, '0').slice(0, 8)), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const counter = BigInt(Math.floor(Date.now() / 30000))
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setBigUint64(0, counter, false)
  const sig = await crypto.subtle.sign('HMAC', key, buf)
  const sigArr = new Uint8Array(sig)
  const offset = sigArr[sigArr.length - 1] & 0xf
  const code = ((sigArr[offset] & 0x7f) << 24) | (sigArr[offset + 1] << 16) | (sigArr[offset + 2] << 8) | sigArr[offset + 3]
  return (code % 1000000).toString().padStart(6, '0')
}

export function Totp() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP')
  const [code, setCode] = useState('------')
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    let cancelled = false
    const gen = async () => { if (!cancelled && secret) setCode(await totp(secret)) }
    gen().catch(() => {})
    const id = setInterval(() => {
      const left = 30 - Math.floor((Date.now() / 1000) % 30)
      setTimeLeft(left)
      if (left === 30) gen().catch(() => {})
    }, 1000)
    return () => { cancelled = true; clearInterval(id) }
  }, [secret])

  const copy = () => { navigator.clipboard.writeText(code).then(() => toast.success('Copied'), () => toast.error('Copy failed')) }

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div>
        <Label>Secret Key (Base32)</Label>
        <div className="flex gap-2">
          <Input value={secret} onChange={e => setSecret(e.target.value)} className="font-mono" placeholder="Base32 secret" />
          <Button onClick={() => { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let k = ''; for (let i = 0; i < 16; i++) k += c[Math.floor(Math.random() * c.length)]; setSecret(k) }} variant="outline" size="sm">🎲</Button>
        </div>
      </div>

      <div className="text-5xl font-bold font-mono tracking-widest">{code}</div>

      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / 30) * 100}%` }} />
      </div>

      <Button onClick={copy} variant="outline">📋 Copy Code</Button>

      <p className="text-xs text-muted-foreground">TOTP (RFC 6238) — 30s rotating, SHA-1, 6 digits</p>
    </div>
  )
}
