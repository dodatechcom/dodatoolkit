import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function ImageCompressor() {
  const [original, setOriginal] = useState<{ name: string; size: number; url: string; type: string } | null>(null)
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null)
  const [quality, setQuality] = useState(0.7)
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    setCompressed(null)
    const reader = new FileReader()
    reader.onload = e => {
      setOriginal({ name: file.name, size: file.size, url: e.target?.result as string, type: file.type })
    }
    reader.readAsDataURL(file)
  }, [])

  const compress = () => {
    if (!original) return
    setLoading(true)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const outType = original.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const dataUrl = canvas.toDataURL(outType, quality)
      const base64 = dataUrl.split(',')[1]
      const size = Math.round(base64.length * 3 / 4)
      setCompressed({ url: dataUrl, size })
      setLoading(false)
      toast.success('Image compressed!')
    }
    img.src = original.url
  }

  const download = () => {
    if (!compressed) return
    const a = document.createElement('a')
    a.href = compressed.url
    a.download = original ? `compressed-${original.name}` : 'compressed-image.png'
    a.click()
    toast.success('Downloaded')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
        {original && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Quality:</span>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-24" />
              <span className="text-xs font-mono">{Math.round(quality * 100)}%</span>
            </div>
            <Button onClick={compress} disabled={loading} size="sm">{loading ? '⏳ Compressing...' : '🗜️ Compress'}</Button>
          </>
        )}
      </div>

      {original && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Original ({(original.size / 1024).toFixed(1)} KB)</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
              <img src={original.url} alt="Original" className="max-w-full h-auto max-h-64 object-contain mx-auto" />
            </div>
          </div>
          <div>
            <Label>Compressed</Label>
            {compressed ? (
              <div>
                <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
                  <img src={compressed.url} alt="Compressed" className="max-w-full h-auto max-h-64 object-contain mx-auto" />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="secondary">
                    {(compressed.size / 1024).toFixed(1)} KB
                    {' '}
                    ({Math.round((1 - compressed.size / original.size) * 100)}% smaller)
                  </Badge>
                  <Button onClick={download} variant="outline" size="sm">⬇️ Download</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed text-muted-foreground text-sm">
                Click compress to see result
              </div>
            )}
          </div>
        </div>
      )}

      {!original && (
        <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
          Upload an image to compress
        </div>
      )}
    </div>
  )
}