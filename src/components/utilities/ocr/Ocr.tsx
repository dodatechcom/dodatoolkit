import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createWorker } from 'tesseract.js'
import toast from 'react-hot-toast'

export function Ocr() {
  const [image, setImage] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
    setText('')
    setProgress(0)
  }, [])

  const extractText = async () => {
    if (!image) return
    setLoading(true)
    setProgress(0)
    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })
      const { data } = await worker.recognize(image)
      setText(data.text)
      await worker.terminate()
      toast.success('Text extracted successfully!')
    } catch (e) {
      toast.error('OCR failed: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied to clipboard')
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
        {image && (
          <Button onClick={extractText} disabled={loading} size="sm">
            {loading ? `🔍 OCR ${progress}%` : '🔍 Extract Text'}
          </Button>
        )}
      </div>

      {loading && (
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

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
          <div className="flex items-center justify-between mb-2">
            <Label>Extracted Text</Label>
            {text && (
              <button onClick={copyText} className="text-xs text-muted-foreground hover:text-foreground">
                📋 Copy
              </button>
            )}
          </div>
          <Textarea
            value={text}
            readOnly
            rows={10}
            className="font-mono text-sm"
            placeholder={loading ? 'Recognizing...' : image ? 'Click "Extract Text" to start OCR' : 'Upload an image to extract text'}
          />
        </div>
      </div>
    </div>
  )
}