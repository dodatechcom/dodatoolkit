import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function generateSVG(w: number, h: number, text: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#e2e8f0"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.8"/>
    <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0.8"/>
  </linearGradient></defs>
  <text x="50%" y="50%" text-anchor="middle" dy=".1em" fill="white" font-family="sans-serif" font-size="${Math.min(w, h) * 0.08}">${text}</text>
</svg>`
}

export function PlaceholderImages() {
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(200)
  const [label, setLabel] = useState('400 × 200')

  const svg = useMemo(() => generateSVG(width, height, label), [width, height, label])
  const dataUrl = useMemo(() => `data:image/svg+xml,${encodeURIComponent(svg)}`, [svg])

  const download = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = `placeholder-${width}x${height}.svg`; a.click()
    toast.success('Downloaded')
  }

  const copySvg = () => { navigator.clipboard.writeText(svg).catch(() => {}); toast.success('SVG copied') }
  const copyUrl = () => { navigator.clipboard.writeText(dataUrl).catch(() => {}); toast.success('Data URL copied') }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Width (px)</Label>
          <Input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value) || 1)} className="font-mono" />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 1)} className="font-mono" />
        </div>
        <div>
          <Label>Label</Label>
          <Input value={label} onChange={e => setLabel(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          [400, 200], [800, 600], [1200, 300], [200, 200], [300, 600],
        ].map(([w, h]) => (
          <button key={`${w}x${h}`} onClick={() => { setWidth(w); setHeight(h); setLabel(`${w} × ${h}`) }}
            className="px-3 py-1 text-xs rounded-md border bg-white/40 dark:bg-white/5 hover:bg-white/60">
            {w} × {h}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={download} size="sm">⬇️ Download SVG</Button>
        <Button onClick={copySvg} variant="outline" size="sm">📋 Copy SVG</Button>
        <Button onClick={copyUrl} variant="outline" size="sm">📋 Copy Data URL</Button>
      </div>

      <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
        <img src={dataUrl} alt="Placeholder" className="mx-auto" style={{ maxWidth: '100%' }} />
      </div>
    </div>
  )
}
