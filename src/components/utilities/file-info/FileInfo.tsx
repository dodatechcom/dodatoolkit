import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0; let size = bytes
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
  return `${size.toFixed(1)} ${units[i]}`
}

interface FileData {
  name: string
  size: number
  type: string
  lastModified: string
  dimensions?: string
}

export function FileInfo() {
  const [info, setInfo] = useState<FileData | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
    const data: FileData = {
      name: file.name,
      size: file.size,
      type: file.type || '(unknown)',
      lastModified: new Date(file.lastModified).toLocaleString(),
    }
    if (file.type.startsWith('image/')) {
      const img = new Image()
      const url = URL.createObjectURL(file)
      objectUrlRef.current = url
      img.onload = () => {
        data.dimensions = `${img.naturalWidth} × ${img.naturalHeight} px`
        setInfo({ ...data })
      }
      img.src = url
    } else {
      setInfo(data)
    }
  }, [])

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <input type="file" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
      </div>

      {info && (
        <div className="space-y-2">
          {[
            { label: '📄 Name', value: info.name },
            { label: '📦 Size', value: formatSize(info.size) },
            { label: '🏷️ Type', value: info.type },
            { label: '🕐 Modified', value: info.lastModified },
            ...(info.dimensions ? [{ label: '📐 Dimensions', value: info.dimensions }] : []),
          ].map(f => (
            <Card key={f.label} className="bg-white/40 dark:bg-white/5">
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-sm">{f.label}</span>
                <span className="text-sm font-mono font-medium">{f.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!info && (
        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed text-muted-foreground text-sm">
          Drop a file to see its info
        </div>
      )}
    </div>
  )
}
