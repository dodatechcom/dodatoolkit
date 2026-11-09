import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Preview {
  title: string
  description: string
  image: string
  siteName: string
  url: string
}

function normalizeUrl(raw: string): string {
  let u = raw.trim()
  if (!u) return ''
  if (!/^https?:\/\//i.test(u)) {
    u = 'https://' + u
  }
  return u
}

const SAMPLE_URLS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { label: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { label: 'DodaTech', url: 'https://dodatech.com' },
]

export function LinkPreview() {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const fetchPreview = async (overrideUrl?: string) => {
    const targetInput = overrideUrl || url
    const cleanUrl = normalizeUrl(targetInput)
    if (!cleanUrl) {
      toast.error('Please enter a valid URL')
      return
    }

    try {
      new URL(cleanUrl)
    } catch {
      toast.error('Invalid URL format')
      return
    }

    setUrl(cleanUrl)
    setLoading(true)
    setPreview(null)
    setImgError(false)

    // Strategy 1: If in Electron desktop app, use direct native IPC fetch (no CORS, no rate limit)
    if (window.electronAPI?.fetchUrlMetadata) {
      try {
        const res = await window.electronAPI.fetchUrlMetadata(cleanUrl)
        if (res && !res.error && (res.title || res.description)) {
          setPreview({
            title: res.title || cleanUrl,
            description: res.description || 'No description available',
            image: res.image || '',
            siteName: res.siteName || new URL(cleanUrl).hostname,
            url: cleanUrl,
          })
          setLoading(false)
          toast.success('Preview loaded!')
          return
        }
      } catch {
        // Fallback to web API
      }
    }

    // Strategy 2: Web API via microlink
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}`)
      const data = await res.json()
      if (data.status === 'success' && data.data) {
        const domain = new URL(cleanUrl).hostname
        setPreview({
          title: data.data.title || cleanUrl,
          description: data.data.description || 'No description available for this link',
          image: data.data.image?.url || data.data.logo?.url || '',
          siteName: data.data.publisher || domain,
          url: cleanUrl,
        })
        toast.success('Preview loaded!')
      } else {
        toast.error(data.message || 'Could not fetch metadata for this link')
      }
    } catch {
      toast.error('Network error: Could not reach link preview service')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchPreview()
  }

  const openUrl = (target: string) => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(target)
    } else {
      window.open(target, '_blank', 'noopener,noreferrer')
    }
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success(`Copied ${label}!`)
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="text-sm font-semibold">Webpage or Article URL</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground mr-1">Try:</span>
                {SAMPLE_URLS.map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setUrl(s.url)
                      fetchPreview(s.url)
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-accent/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. github.com or https://example.com"
                className="font-mono text-sm"
              />
              <Button onClick={() => fetchPreview()} disabled={loading} variant="glass" className="min-w-[110px]">
                {loading ? '⏳ Loading...' : '🔍 Preview'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Fetching OpenGraph and page metadata...</p>
          </CardContent>
        </Card>
      )}

      {preview && !loading && (
        <Card className="glass border-none shadow-xl overflow-hidden">
          {preview.image && !imgError && (
            <div className="relative w-full h-56 bg-black/20 overflow-hidden border-b border-border/40">
              <img
                src={preview.image}
                alt={preview.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                🌐 {preview.siteName}
              </Badge>
              <button
                type="button"
                onClick={() => openUrl(preview.url)}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Visit Site ↗
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold leading-snug">{preview.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {preview.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground truncate max-w-[340px]">
                {preview.url}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyText(preview.url, 'URL')}
                  className="text-xs h-8"
                >
                  📋 Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyText(`${preview.title}\n${preview.description}`, 'preview')}
                  className="text-xs h-8"
                >
                  📄 Copy Info
                </Button>
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => openUrl(preview.url)}
                  className="text-xs h-8"
                >
                  🔗 Open Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!preview && !loading && (
        <div className="text-center text-muted-foreground py-10 text-sm">
          Enter any URL (e.g. <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">github.com</code>) or click a quick sample above to generate its preview.
        </div>
      )}
    </div>
  )
}
