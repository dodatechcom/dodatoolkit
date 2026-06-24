import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function UrlParser() {
  const [url, setUrl] = useState('https://example.com:8080/path/to/page?name=John&age=30#section')

  const parsed = useMemo(() => {
    try {
      const u = new URL(url)
      const params: { key: string; value: string }[] = []
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }))
      return {
        valid: true as const,
        protocol: u.protocol, hostname: u.hostname, port: u.port || '(default)',
        host: u.host, pathname: u.pathname, search: u.search || '(none)',
        hash: u.hash || '(none)', origin: u.origin, params,
      }
    } catch {
      return { valid: false as const }
    }
  }, [url])

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <Label>URL</Label>
        <Input value={url} onChange={e => setUrl(e.target.value)} className="font-mono" placeholder="https://..." />
      </div>

      {parsed.valid ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '🔗 Protocol', value: parsed.protocol },
              { label: '🏠 Host', value: parsed.host },
              { label: '📍 Hostname', value: parsed.hostname },
              { label: '🔌 Port', value: parsed.port },
              { label: '📁 Path', value: parsed.pathname },
              { label: '🔍 Query String', value: parsed.search },
              { label: '🔖 Hash', value: parsed.hash },
              { label: '🌐 Origin', value: parsed.origin },
            ].map(f => (
              <Card key={f.label} className="bg-white/40 dark:bg-white/5">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="text-sm font-mono break-all mt-0.5">{f.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {parsed.params.length > 0 && (
            <div>
              <Label>Query Parameters</Label>
              <div className="space-y-1">
                {parsed.params.map(p => (
                  <Card key={p.key} className="bg-amber-50/50 dark:bg-amber-900/10">
                    <CardContent className="p-2 flex items-center gap-2 text-sm font-mono">
                      <Badge variant="outline" className="text-xs">{p.key}</Badge>
                      <span>=</span>
                      <span>{p.value}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-200">
          <CardContent className="p-3 text-sm">Invalid URL — enter a valid URL to parse</CardContent>
        </Card>
      )}
    </div>
  )
}
