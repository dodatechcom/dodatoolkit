import { useState, useMemo, useEffect, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const sample = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#6366f1" />
  <text x="100" y="110" text-anchor="middle" fill="white" font-size="24" font-family="sans-serif">SVG</text>
</svg>`

export function SvgViewer() {
  const [code, setCode] = useState(sample)
  const [error, setError] = useState('')
  const prevUrlRef = useRef<string | null>(null)

  const svgUrl = useMemo(() => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    const url = URL.createObjectURL(new Blob([code], { type: 'image/svg+xml' }))
    prevUrlRef.current = url
    return url
  }, [code])

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    }
  }, [])

  const download = () => {
    const blob = new Blob([code], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'image.svg'; a.click()
    URL.revokeObjectURL(url)
    toast.success('SVG downloaded')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => toast.success('Code copied'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">SVG</Badge>
        <Button onClick={download} size="sm">⬇️ Download</Button>
        <Button onClick={copyCode} variant="outline" size="sm">📋 Copy Code</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>SVG Code</Label>
          <Textarea value={code} onChange={e => { setCode(e.target.value); setError('') }} rows={12} className="font-mono text-sm" />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div>
          <Label>Preview</Label>
          <div className="rounded-lg border bg-white/40 dark:bg-white/5 flex items-center justify-center min-h-[300px] p-4" onError={() => setError('Invalid SVG')}>
            <img src={svgUrl} alt="SVG preview" className="max-w-full max-h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
