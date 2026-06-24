import { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function MetadataCleaner() {
  const [file, setFile] = useState<{ name: string; size: number; url: string; type: string } | null>(null)
  const [cleaned, setCleaned] = useState<{ url: string; size: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('Please select an image'); return }
    setCleaned(null)
    const reader = new FileReader()
    reader.onload = e => {
      setFile({ name: f.name, size: f.size, url: e.target?.result as string, type: f.type })
    }
    reader.readAsDataURL(f)
  }

  const stripMetadata = () => {
    if (!file) return
    setLoading(true)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const dataUrl = canvas.toDataURL(mime, 0.95)
      const base64 = dataUrl.split(',')[1]
      const size = Math.round(base64.length * 3 / 4)
      setCleaned({ url: dataUrl, size })
      setLoading(false)
      toast.success('Metadata stripped!')
    }
    img.src = file.url
  }

  const download = () => {
    if (!cleaned || !file) return
    const a = document.createElement('a')
    a.href = cleaned.url
    const dot = file.name.lastIndexOf('.')
    const baseName = dot > 0 ? file.name.slice(0, dot) : file.name
    const ext = file.type === 'image/png' ? '.png' : '.jpg'
    a.download = `${baseName}-clean${ext}`
    a.click()
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Images often carry hidden metadata (camera model, GPS location, timestamps). This tool removes all EXIF data by re-encoding the image through a clean canvas.
      </p>

      <div>
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
      </div>

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Original ({(file.size / 1024).toFixed(1)} KB)</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5 mt-1">
              <img src={file.url} alt="Original" className="max-w-full h-auto max-h-64 object-contain mx-auto" />
            </div>
            <Badge variant="outline" className="mt-2">⚠️ Contains metadata</Badge>
          </div>
          <div>
            <Label>Cleaned</Label>
            {cleaned ? (
              <div>
                <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5 mt-1">
                  <img src={cleaned.url} alt="Cleaned" className="max-w-full h-auto max-h-64 object-contain mx-auto" />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary">{(cleaned.size / 1024).toFixed(1)} KB</Badge>
                  <Badge variant="outline" className="text-green-600">✅ Metadata free</Badge>
                  <Button onClick={download} variant="outline" size="sm">⬇️ Download</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-dashed text-muted-foreground text-sm mt-1 gap-3">
                <Button onClick={stripMetadata} disabled={loading}>
                  {loading ? '⏳ Processing...' : '🧹 Strip Metadata'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {!file && (
        <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
          Upload an image to clean its metadata
        </div>
      )}
    </div>
  )
}
