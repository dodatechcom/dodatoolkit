import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function arrayToPem(data: ArrayBuffer, label: string): string {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(data)))
  const lines = b64.match(/.{1,64}/g) || []
  return `-----BEGIN ${label} KEY-----\n${lines.join('\n')}\n-----END ${label} KEY-----`
}

async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('spki', key)
  return arrayToPem(raw, 'PUBLIC')
}

async function exportPrivate(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('pkcs8', key)
  return arrayToPem(raw, 'PRIVATE')
}

export function RsaKeys() {
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const { publicKey: pub, privateKey: priv } = await crypto.subtle.generateKey(
        { name: 'RSA-PSS', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true, ['sign', 'verify']
      )
      const [pubStr, privStr] = await Promise.all([exportKey(pub), exportPrivate(priv)])
      setPublicKey(pubStr); setPrivateKey(privStr)
      toast.success('RSA key pair generated!')
    } catch (e) { toast.error('Generation failed') }
    finally { setLoading(false) }
  }

  const copy = (val: string) => { navigator.clipboard.writeText(val).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <Button onClick={generate} disabled={loading} size="lg" className="w-full text-lg">
        {loading ? '⏳ Generating...' : '🔑 Generate RSA Key Pair (2048-bit)'}
      </Button>

      {publicKey && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">🔓 Public Key</Badge>
              <button onClick={() => copy(publicKey)} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
            </div>
            <Textarea value={publicKey} readOnly rows={6} className="font-mono text-xs mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">🔐 Private Key</Badge>
              <button onClick={() => copy(privateKey)} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
            </div>
            <Textarea value={privateKey} readOnly rows={8} className="font-mono text-xs mt-1" />
          </div>
        </div>
      )}

      {!publicKey && !loading && (
        <div className="text-center text-muted-foreground text-sm py-12">
          Click generate to create a new RSA-2048 key pair
        </div>
      )}
    </div>
  )
}
