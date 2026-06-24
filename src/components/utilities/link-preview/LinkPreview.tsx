import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Preview {
  title: string
  description: string
  image: string
  siteName: string
}

export function LinkPreview() {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPreview = async () => {
    if (!url.trim()) return
    setLoading(true)
    setPreview(null)
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.data) {
        setPreview({
          title: data.data.title || '',
          description: data.data.description || '',
          image: data.data.image?.url || '',
          siteName: data.data.lang || '',
        })
      }
    } catch {
      toast.error('Could not fetch preview')
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchPreview()
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="font-mono text-sm"
        />
        <Button onClick={fetchPreview} disabled={loading} size="sm">{loading ? '⏳' : '🔍 Preview'}</Button>
      </div>

      {preview && (
        <Card>
          <CardContent className="p-4 space-y-3">
            {preview.image && (
              <img src={preview.image} alt="" className="w-full h-48 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
            )}
            <div>
              <p className="text-xs text-muted-foreground">{preview.siteName}</p>
              <p className="font-semibold">{preview.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-3">{preview.description}</p>
            </div>
            <Badge variant="outline" className="truncate max-w-full">{url}</Badge>
          </CardContent>
        </Card>
      )}

      {!preview && !loading && url.trim() && (
        <div className="text-center text-muted-foreground py-8 text-sm">
          Press Enter or click Preview to fetch
        </div>
      )}
    </div>
  )
}
