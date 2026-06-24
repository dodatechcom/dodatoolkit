import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { md5 } from '@/lib/md5'

async function hashString(algo: string, text: string): Promise<string> {
  if (algo === 'MD5') return md5(text)
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const [m, sha1, sha256, sha512] = await Promise.all([
        hashString('MD5', input),
        hashString('SHA-1', input),
        hashString('SHA-256', input),
        hashString('SHA-512', input),
      ])
      setHashes({ MD5: m, 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-512': sha512 })
    } catch {
      toast.error('Failed to generate hashes')
    }
    setLoading(false)
  }, [input])

  function copyHash(key: string) {
    navigator.clipboard.writeText(hashes[key]).then(
      () => toast.success(`${key} copied!`),
      () => toast.error('Copy failed')
    )
  }

  function copyAll() {
    const text = Object.entries(hashes)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    navigator.clipboard.writeText(text).then(
      () => toast.success('All hashes copied!'),
      () => toast.error('Copy failed')
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input Text</label>
            {input && <Badge variant="secondary">{input.length} chars</Badge>}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button onClick={generate} disabled={loading || !input.trim()} variant="glass">
              {loading ? '⏳ Hashing...' : '🔑 Generate Hashes'}
            </Button>
            {input && <Button onClick={() => { setInput(''); setHashes({}) }} variant="ghost">Clear</Button>}
          </div>
        </CardContent>
      </Card>

      {Object.keys(hashes).length > 0 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generated Hashes</span>
              <Button onClick={copyAll} variant="ghost" size="sm">📋 Copy All</Button>
            </div>
            {Object.entries(hashes).map(([algo, hash]) => (
              <div
                key={algo}
                className="group flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => copyHash(algo)}
              >
                <Badge variant="outline" className="w-16 shrink-0">{algo}</Badge>
                <code className="flex-1 font-mono text-sm break-all">{hash}</code>
                <span className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground transition-opacity shrink-0">📋</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
