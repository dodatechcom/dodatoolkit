import { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const formats = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/bmp', label: 'BMP' },
]

export function ImageConverter() {
  const [file, setFile] = useState<{ name: string; dataUrl: string; type: string } | null>(null)
  const [format, setFormat] = useState('image/png')
  const [outputs, setOutputs] = useState<{ url: string; size: number; type: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('Please select an image'); return }
    setOutputs([])
    const reader = new FileReader()
    reader.onload = e => setFile({ name: f.name, dataUrl: e.target?.result as string, type: f.type })
    reader.readAsDataURL(f)
  }, [])

  const convert = () => {
    if (!file) return
    setLoading(true)
    setOutputs([])
    const img = new Image()
    img.onload = () => {
      const results: { url: string; size: number; type: string }[] = []
      const targets = format === 'all' ? formats.map(f => f.value) : [format]
      targets.forEach(fmt => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL(fmt, 0.92)
        const base64 = dataUrl.split(',')[1]
        results.push({ url: dataUrl, size: Math.round(base64.length * 3 / 4), type: fmt })
      })
      setOutputs(results)
      setLoading(false)
      toast.success(`Converted to ${results.length} format${results.length > 1 ? 's' : ''}`)
    }
    img.src = file.dataUrl
  }

  const download = (url: string, ext: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = file ? `${file.name.split('.')[0]}.${ext}` : `converted.${ext}`
    a.click()
  }

  const extMap: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/bmp': 'bmp' }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3 flex-wrap">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
        {file && (
          <>
            <Select
              value={format}
              onChange={e => setFormat(e.target.value)}
              options={[...formats.map(f => ({ value: f.value, label: f.label })), { value: 'all', label: 'All Formats' }]}
              className="w-28"
            />
            <Button onClick={convert} disabled={loading} size="sm">{loading ? '⏳...' : '🔄 Convert'}</Button>
          </>
        )}
      </div>

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Original ({(file.dataUrl.length * 3 / 4 / 1024).toFixed(1)} KB)</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5 mt-1">
              <img src={file.dataUrl} alt="Original" className="max-w-full h-auto max-h-48 object-contain mx-auto" />
            </div>
            <Badge variant="outline" className="mt-2">{file.type.split('/')[1].toUpperCase()}</Badge>
          </div>
          <div>
            <Label>Converted</Label>
            <div className="space-y-3 mt-1">
              {outputs.length === 0 && !loading && (
                <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
                  Choose a format and click Convert
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
                  ⏳ Converting...
                </div>
              )}
              {outputs.map((out, i) => (
                <Card key={i}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <img src={out.url} alt={`Converted ${i}`} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <Badge>{extMap[out.type]?.toUpperCase() || out.type.split('/')[1].toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground ml-2">{(out.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <Button onClick={() => download(out.url, extMap[out.type] || 'png')} variant="outline" size="sm">⬇️</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {!file && (
        <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
          Upload an image to convert formats
        </div>
      )}
    </div>
  )
}
