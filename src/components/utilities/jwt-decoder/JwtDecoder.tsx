import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    return atob(padded)
  } catch {
    return '(invalid base64)'
  }
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoidXNlciJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function JwtDecoder() {
  const [token, setToken] = useState(sampleJwt)

  const parts = useMemo(() => {
    const p = token.trim().split('.')
    if (p.length !== 3) return { error: 'Invalid JWT: expected 3 parts separated by dots' }

    const [headerRaw, payloadRaw, signature] = p

    let header: string
    let payload: string
    try {
      header = formatJson(decodeBase64Url(headerRaw))
      payload = formatJson(decodeBase64Url(payloadRaw))
    } catch {
      return { error: 'Failed to decode JWT parts' }
    }

    let headerObj: Record<string, unknown> | null = null
    let payloadObj: Record<string, unknown> | null = null
    try { headerObj = JSON.parse(decodeBase64Url(headerRaw)) } catch {}
    try { payloadObj = JSON.parse(decodeBase64Url(payloadRaw)) } catch {}

    return {
      header,
      payload,
      signature,
      headerObj,
      payloadObj,
      error: null,
    }
  }, [token])

  return (
    <div className="space-y-4">
      <div>
        <Label>JWT Token</Label>
        <Textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          rows={3}
          className="font-mono text-sm"
          placeholder="Paste JWT token here..."
        />
      </div>

      {'error' in parts && parts.error ? (
        <p className="text-red-500 text-sm">{parts.error}</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-indigo-500 dark:bg-indigo-600">Header</Badge>
                  <span className="text-xs text-muted-foreground">Algorithm</span>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">
                  {parts.header}
                </pre>
              </CardContent>
            </Card>
            <Card className="md:col-span-1 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-emerald-500 dark:bg-emerald-600">Payload</Badge>
                  <span className="text-xs text-muted-foreground">Data</span>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">
                  {parts.payload}
                </pre>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-amber-500 dark:bg-amber-600">Signature</Badge>
                  <span className="text-xs text-muted-foreground">⚠️ Not verified</span>
                </div>
                <code className="text-xs font-mono break-all">{parts.signature}</code>
              </CardContent>
            </Card>
          </div>

          {parts.payloadObj && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Claims</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(parts.payloadObj).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 p-2 rounded bg-white/40 dark:bg-white/5">
                      <Badge variant="outline" className="text-xs font-mono shrink-0">{key}</Badge>
                      <span className="text-sm font-mono break-all">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}