import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { md5File } from '@/lib/md5'

async function hashFile(file: File, algo: string): Promise<string> {
  if (algo === 'MD5') return md5File(file)
  const buffer = await file.arrayBuffer()
  const hash = await crypto.subtle.digest(algo, buffer)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function HashChecker() {
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)
  const [md5, setMd5] = useState('')
  const [sha1, setSha1] = useState('')
  const [sha256, setSha256] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback(async (f: File) => {
    setFile({ name: f.name, size: f.size })
    setLoading(true)
    try {
      const [m, s1, s256] = await Promise.all([
        hashFile(f, 'MD5'),
        hashFile(f, 'SHA-1'),
        hashFile(f, 'SHA-256'),
      ])
      setMd5(m); setSha1(s1); setSha256(s256)
    } catch (e) {
      toast.error('Hashing failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const copy = (val: string) => {
    navigator.clipboard.writeText(val).then(() => toast.success('Copied'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4">
      <div>
        <input type="file" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Hashing file...</p>}

      {file && !loading && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
          <div className="space-y-2">
            {[
              { label: 'MD5', value: md5, color: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200' },
              { label: 'SHA-1', value: sha1, color: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200' },
              { label: 'SHA-256', value: sha256, color: 'bg-green-100 dark:bg-green-900/20 border-green-200' },
            ].map(h => (
              <Card key={h.label} className={h.color}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">{h.label}</Badge>
                  <code className="text-xs font-mono break-all flex-1">{h.value}</code>
                  <button onClick={() => copy(h.value)} className="text-xs text-muted-foreground hover:text-foreground shrink-0">📋</button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!file && !loading && (
        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed text-muted-foreground text-sm">
          Drop a file to compute its hash checksums
        </div>
      )}
    </div>
  )
}
