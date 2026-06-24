import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'

export function BrowserInfo() {
  const [ip, setIp] = useState('Loading...')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetch('https://ip-api.com/json/')
      .then(r => r.json())
      .then(d => { setIp(d.query); setLocation(`${d.city}, ${d.country}`) })
      .catch(() => { setIp('Unavailable'); setLocation('Unavailable') })
  }, [])

  const info = [
    { label: '🌐 Public IP', value: ip },
    { label: '📍 Location', value: location },
    { label: '🧭 Browser', value: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/\S+/)?.[0] || 'Unknown' },
    { label: '💻 OS', value: navigator.platform },
    { label: '🔤 Language', value: navigator.language },
    { label: '🖥️ Screen', value: `${screen.width} × ${screen.height}` },
    { label: '📐 Viewport', value: `${window.innerWidth} × ${window.innerHeight}` },
    { label: '🎨 Color Depth', value: `${screen.colorDepth}-bit` },
    { label: '🔋 Online', value: navigator.onLine ? 'Yes' : 'No' },
    { label: '🧠 Cores', value: `${navigator.hardwareConcurrency || '?'} logical` },
  ]

  const copyAll = () => {
    const text = info.map(i => `${i.label}: ${i.value}`).join('\n')
    navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied')
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <button onClick={copyAll} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy All</button>
      <div className="space-y-2">
        {info.map(i => (
          <Card key={i.label} className="bg-white/40 dark:bg-white/5">
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm">{i.label}</span>
              <span className="text-sm font-mono font-medium">{i.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
