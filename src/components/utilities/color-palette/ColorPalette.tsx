import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface ColorSwatch {
  hex: string
  r: number
  g: number
  b: number
  count: number
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  )
}

function extractPalette(imageData: ImageData, colorCount: number = 8): ColorSwatch[] {
  const data = imageData.data
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>()

  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 16) * 16
    const g = Math.round(data[i + 1] / 16) * 16
    const b = Math.round(data[i + 2] / 16) * 16
    const key = `${r},${g},${b}`

    const existing = colorMap.get(key)
    if (existing) {
      existing.count++
    } else {
      colorMap.set(key, { r, g, b, count: 1 })
    }
  }

  const sorted = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount)

  const merged: ColorSwatch[] = []
  for (const c of sorted) {
    const hex = rgbToHex(c.r, c.g, c.b)
    merged.push({ hex, r: c.r, g: c.g, b: c.b, count: c.count })
  }

  return merged
}

export function ColorPalette() {
  const [image, setImage] = useState<string | null>(null)
  const [palette, setPalette] = useState<ColorSwatch[]>([])
  const [colorCount, setColorCount] = useState(8)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const url = e.target?.result as string
      setImage(url)
      processImage(url, colorCount)
    }
    reader.readAsDataURL(file)
  }, [colorCount])

  const processImage = (url: string, count: number) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 200
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractPalette(imageData, count)
      setPalette(colors)
    }
    img.src = url
  }

  const handleColorCount = (n: number) => {
    setColorCount(n)
    if (image) processImage(image, n)
  }

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {})
    toast.success(`Copied ${hex}`)
  }

  const copyAll = () => {
    const all = palette.map(c => c.hex).join(', ')
    navigator.clipboard.writeText(all).catch(() => {})
    toast.success('Copied all colors')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Colors:</span>
          {[4, 6, 8, 10].map(n => (
            <button
              key={n}
              onClick={() => handleColorCount(n)}
              className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                colorCount === n
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white/40 dark:bg-white/5 hover:bg-white/60'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {palette.length > 0 && (
          <Button onClick={copyAll} variant="outline" size="sm">
            📋 Copy All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {image && (
          <div>
            <Label>Image</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
              <img src={image} alt="Uploaded" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
            </div>
          </div>
        )}
        <div className={image ? '' : 'md:col-span-2'}>
          <Label>Color Palette</Label>
          {palette.length > 0 ? (
            <div className="space-y-2">
              <div className="flex rounded-lg overflow-hidden h-12 border">
                {palette.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 cursor-pointer transition-transform hover:scale-y-110"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => copyHex(c.hex)}
                    title={c.hex}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {palette.map((c, i) => (
                  <Card
                    key={i}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white/40 dark:bg-white/5"
                    onClick={() => copyHex(c.hex)}
                  >
                    <CardContent className="p-2 flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-md border shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-xs font-mono">
                        <div>{c.hex}</div>
                        <div className="text-muted-foreground">
                          rgb({c.r}, {c.g}, {c.b})
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
              Upload an image to extract its color palette
            </div>
          )}
        </div>
      </div>
    </div>
  )
}