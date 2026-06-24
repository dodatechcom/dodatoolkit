import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import toast from 'react-hot-toast'

export function QRCodeGenerator() {
  const [text, setText] = useState('https://doda-toolkit.app')
  const [fgColor, setFgColor] = useState('#6366f1')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState('256')
  const [level, setLevel] = useState('M')
  const canvasRef = useRef<HTMLDivElement>(null)

  function downloadQR() {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qrcode-${Date.now()}.png`
    a.click()
    toast.success('QR code downloaded!')
  }

  return (
    <div className="max-w-2xl">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Text or URL</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL..."
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Foreground Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-input"
                />
                <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-input"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size (px)</Label>
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={[
                  { value: '128', label: '128 × 128' },
                  { value: '256', label: '256 × 256' },
                  { value: '384', label: '384 × 384' },
                  { value: '512', label: '512 × 512' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>Error Correction</Label>
              <Select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                options={[
                  { value: 'L', label: 'L - Low (7%)' },
                  { value: 'M', label: 'M - Medium (15%)' },
                  { value: 'Q', label: 'Q - Quartile (25%)' },
                  { value: 'H', label: 'H - High (30%)' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-none shadow-xl mt-4">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div
            ref={canvasRef}
            className="p-4 rounded-2xl shadow-inner"
            style={{ backgroundColor: bgColor }}
          >
            {text.trim() ? (
              <QRCodeCanvas
                value={text}
                size={Number(size)}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level as 'L' | 'M' | 'Q' | 'H'}
                includeMargin
              />
            ) : (
              <div
                className="flex items-center justify-center text-muted-foreground"
                style={{ width: Number(size), height: Number(size) }}
              >
                Enter text to generate QR code
              </div>
            )}
          </div>
          <Button onClick={downloadQR} size="lg" variant="glass" className="w-full max-w-xs">
            ⬇️ Download PNG
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
