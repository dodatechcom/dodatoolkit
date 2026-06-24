import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const mimes = [
  { ext: '.html', mime: 'text/html', cat: 'text' },
  { ext: '.css', mime: 'text/css', cat: 'text' },
  { ext: '.js', mime: 'text/javascript', cat: 'text' },
  { ext: '.json', mime: 'application/json', cat: 'application' },
  { ext: '.xml', mime: 'application/xml', cat: 'application' },
  { ext: '.txt', mime: 'text/plain', cat: 'text' },
  { ext: '.csv', mime: 'text/csv', cat: 'text' },
  { ext: '.md', mime: 'text/markdown', cat: 'text' },
  { ext: '.pdf', mime: 'application/pdf', cat: 'application' },
  { ext: '.doc', mime: 'application/msword', cat: 'application' },
  { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', cat: 'application' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', cat: 'application' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', cat: 'application' },
  { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', cat: 'application' },
  { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', cat: 'application' },
  { ext: '.zip', mime: 'application/zip', cat: 'application' },
  { ext: '.tar', mime: 'application/x-tar', cat: 'application' },
  { ext: '.gz', mime: 'application/gzip', cat: 'application' },
  { ext: '.rar', mime: 'application/vnd.rar', cat: 'application' },
  { ext: '.7z', mime: 'application/x-7z-compressed', cat: 'application' },
  { ext: '.png', mime: 'image/png', cat: 'image' },
  { ext: '.jpg', mime: 'image/jpeg', cat: 'image' },
  { ext: '.jpeg', mime: 'image/jpeg', cat: 'image' },
  { ext: '.gif', mime: 'image/gif', cat: 'image' },
  { ext: '.svg', mime: 'image/svg+xml', cat: 'image' },
  { ext: '.webp', mime: 'image/webp', cat: 'image' },
  { ext: '.ico', mime: 'image/x-icon', cat: 'image' },
  { ext: '.bmp', mime: 'image/bmp', cat: 'image' },
  { ext: '.mp3', mime: 'audio/mpeg', cat: 'audio' },
  { ext: '.wav', mime: 'audio/wav', cat: 'audio' },
  { ext: '.ogg', mime: 'audio/ogg', cat: 'audio' },
  { ext: '.mp4', mime: 'video/mp4', cat: 'video' },
  { ext: '.webm', mime: 'video/webm', cat: 'video' },
  { ext: '.avi', mime: 'video/x-msvideo', cat: 'video' },
  { ext: '.mov', mime: 'video/quicktime', cat: 'video' },
  { ext: '.woff', mime: 'font/woff', cat: 'font' },
  { ext: '.woff2', mime: 'font/woff2', cat: 'font' },
  { ext: '.ttf', mime: 'font/ttf', cat: 'font' },
  { ext: '.otf', mime: 'font/otf', cat: 'font' },
  { ext: '.eot', mime: 'application/vnd.ms-fontobject', cat: 'application' },
  { ext: '.wasm', mime: 'application/wasm', cat: 'application' },
  { ext: '.yml', mime: 'application/x-yaml', cat: 'application' },
  { ext: '.yaml', mime: 'application/x-yaml', cat: 'application' },
  { ext: '.ts', mime: 'text/typescript', cat: 'text' },
  { ext: '.tsx', mime: 'text/typescript', cat: 'text' },
  { ext: '.jsx', mime: 'text/javascript', cat: 'text' },
  { ext: '.env', mime: 'text/plain', cat: 'text' },
  { ext: '.sql', mime: 'text/plain', cat: 'text' },
  { ext: '.sh', mime: 'text/x-sh', cat: 'text' },
  { ext: '.bat', mime: 'text/plain', cat: 'text' },
  { ext: '.psd', mime: 'image/vnd.adobe.photoshop', cat: 'image' },
  { ext: '.ai', mime: 'application/postscript', cat: 'application' },
  { ext: '.epub', mime: 'application/epub+zip', cat: 'application' },
  { ext: '.iso', mime: 'application/x-iso9660-image', cat: 'application' },
  { ext: '.dmg', mime: 'application/x-apple-diskimage', cat: 'application' },
  { ext: '.apk', mime: 'application/vnd.android.package-archive', cat: 'application' },
  { ext: '.deb', mime: 'application/vnd.debian.binary-package', cat: 'application' },
  { ext: '.rpm', mime: 'application/x-rpm', cat: 'application' },
]

export function MimeLookup() {
  const [query, setQuery] = useState('.json')

  const results = useMemo(() => {
    if (!query) return mimes
    const q = query.toLowerCase()
    return mimes.filter(m => m.ext.includes(q) || m.mime.includes(q) || m.cat.includes(q))
  }, [query])

  const copy = (v: string) => { navigator.clipboard.writeText(v).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="🔍 Search extension or MIME type..." className="max-w-md" />

      <div className="flex flex-wrap gap-1">
        {['text', 'image', 'audio', 'video', 'font', 'application'].map(cat => (
          <button key={cat} onClick={() => setQuery(cat)}
            className={`px-2 py-1 text-xs rounded border ${query === cat ? 'bg-primary text-primary-foreground' : 'bg-white/30 dark:bg-white/5'}`}>{cat}</button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border max-h-96 overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <tr className="border-b">
              <th className="px-3 py-2 text-left">Extension</th>
              <th className="px-3 py-2 text-left">MIME Type</th>
              <th className="px-3 py-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {results.map(m => (
              <tr key={m.ext} className="border-t border-white/10 hover:bg-white/20 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={() => copy(m.mime)}>
                <td className="px-3 py-1.5 font-bold">{m.ext}</td>
                <td className="px-3 py-1.5 text-indigo-500">{m.mime}</td>
                <td className="px-3 py-1.5"><Badge variant="outline" className="text-[10px]">{m.cat}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{results.length} entries</p>
    </div>
  )
}
