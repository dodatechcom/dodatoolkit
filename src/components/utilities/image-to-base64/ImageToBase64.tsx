import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function ImageToBase64() {
  const [url, setUrl] = useState('')
  const [base64, setBase64] = useState('')
  const [fileName, setFileName] = useState('')
  const [size, setSize] = useState(0)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    setFileName(file.name)
    setSize(file.size)
    const reader = new FileReader()
    reader.onload = e => {
      const data = e.target?.result as string
      setUrl(data)
      setBase64(data)
    }
    reader.readAsDataURL(file)
  }, [])

  const copy = () => { navigator.clipboard.writeText(base64).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
        {base64 && <Button onClick={copy} variant="outline" size="sm">📋 Copy Data URI</Button>}
      </div>

      {url && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Image</Label>
            <div className="rounded-lg border overflow-hidden bg-white/40 dark:bg-white/5">
              <img src={url} alt="Uploaded" className="max-w-full h-auto max-h-48 object-contain mx-auto" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{fileName} ({(size / 1024).toFixed(1)} KB)</div>
          </div>
          <div>
            <Label>Base64 Data URI</Label>
            <Textarea value={base64} readOnly rows={8} className="font-mono text-xs" />
            <div className="text-xs text-muted-foreground mt-1">{base64.length.toLocaleString()} chars</div>
          </div>
        </div>
      )}

      {!url && (
        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed text-muted-foreground text-sm">
          Upload an image to get its Base64 data URI
        </div>
      )}
    </div>
  )
}
