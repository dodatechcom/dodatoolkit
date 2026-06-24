import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import jsQR from 'jsqr'
import toast from 'react-hot-toast'

export function QrScanner() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    setError(''); setResult('')
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const decode = () => {
    if (!image) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        setResult(code.data)
        toast.success('QR code detected!')
      } else {
        setError('No QR code found in image')
      }
    }
    img.src = image
  }

  const copy = () => { navigator.clipboard.writeText(result).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
        {image && <Button onClick={decode} size="sm">🔍 Scan QR</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {image && (
          <div>
            <Label>Image</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
              <img src={image} alt="QR" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
            </div>
          </div>
        )}
        <div className={image ? '' : 'md:col-span-2'}>
          <Label>Decoded Text</Label>
          <Textarea value={result || error} readOnly rows={6} className="font-mono text-sm" placeholder="Upload QR image and click scan" />
          {result && <Button onClick={copy} variant="outline" size="sm" className="mt-2">📋 Copy</Button>}
        </div>
      </div>
    </div>
  )
}