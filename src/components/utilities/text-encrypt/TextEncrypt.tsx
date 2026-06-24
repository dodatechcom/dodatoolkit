import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
    key, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  )
}

function bufToBase64(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf))
}

function base64ToBuf(str: string): Uint8Array {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

export function TextEncrypt() {
  const [text, setText] = useState('')
  const [password, setPassword] = useState('')
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [loading, setLoading] = useState(false)

  const encrypt = async () => {
    if (!text || !password) { toast.error('Enter text and password'); return }
    setLoading(true)
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)
      const encoded = new TextEncoder().encode(text)
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
      const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      result.set(salt, 0); result.set(iv, salt.length); result.set(new Uint8Array(encrypted), salt.length + iv.length)
      setEncrypted(bufToBase64(result))
      toast.success('Encrypted!')
    } catch (e) { toast.error('Encryption failed') }
    finally { setLoading(false) }
  }

  const decrypt = async () => {
    if (!encrypted || !password) { toast.error('Enter encrypted text and password'); return }
    setLoading(true)
    try {
      const data = base64ToBuf(encrypted)
      const salt = data.slice(0, 16); const iv = data.slice(16, 28); const ct = data.slice(28)
      const key = await deriveKey(password, salt)
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
      setDecrypted(new TextDecoder().decode(decrypted))
      toast.success('Decrypted!')
    } catch (e) { toast.error('Decryption failed (wrong password?)') }
    finally { setLoading(false) }
  }

  const copy = () => { navigator.clipboard.writeText(encrypted).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="🔑 Passphrase..." className="max-w-xs font-mono" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Text to Encrypt</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Enter text to encrypt..." />
          <Button onClick={encrypt} disabled={loading} size="sm" className="mt-2">🔒 Encrypt</Button>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Encrypted (Base64)</Label>
            {encrypted && <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>}
          </div>
          <Textarea value={encrypted} readOnly rows={6} className="font-mono text-xs" />
          <Button onClick={decrypt} disabled={loading || !encrypted} size="sm" className="mt-2">🔓 Decrypt</Button>
        </div>
      </div>

      {decrypted && (
        <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200">
          <CardContent className="p-3">
            <Label>Decrypted Result</Label>
            <p className="mt-1">{decrypted}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
