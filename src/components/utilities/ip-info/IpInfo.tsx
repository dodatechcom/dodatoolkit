import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface IpData {
  ip: string
  city: string
  region: string
  country: string
  org: string
  lat: number
  lon: number
  timezone: string
  isp: string
}

export function IpInfo() {
  const [data, setData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [localIps, setLocalIps] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    fetch('https://ip-api.com/json/?fields=query,city,region,country,org,lat,lon,timezone,isp', { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        if (d && d.query) {
          setData({
            ip: d.query,
            city: d.city || '',
            region: d.region || '',
            country: d.country || '',
            org: d.org || '',
            lat: d.lat,
            lon: d.lon,
            timezone: d.timezone || '',
            isp: d.isp || '',
          })
        } else {
          setError('Could not retrieve public IP information')
        }
      })
      .catch(() => setError('Network offline or IP service unreachable'))
      .finally(() => { setLoading(false); clearTimeout(timeout) })

    return () => { clearTimeout(timeout); controller.abort() }
  }, [])

  useEffect(() => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] })
      pc.createDataChannel('')
      pc.onicecandidate = e => {
        if (e.candidate) {
          const ip = e.candidate.candidate.split(' ')[4]
          if (ip && !localIps.includes(ip)) setLocalIps(prev => [...prev, ip])
        }
      }
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {})
      return () => pc.close()
    } catch {}
  }, [])

  const systemInfo = [
    { label: '🧭 Browser', value: typeof navigator !== 'undefined' ? (navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/\S+/)?.[0] || 'Unknown') : 'Unknown' },
    { label: '💻 OS / Platform', value: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown' },
    { label: '🔤 Language', value: typeof navigator !== 'undefined' ? navigator.language : 'Unknown' },
    { label: '🖥️ Screen Resolution', value: typeof screen !== 'undefined' ? `${screen.width} × ${screen.height}` : 'Unknown' },
    { label: '📐 Viewport Size', value: typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : 'Unknown' },
    { label: '🔋 Online Status', value: typeof navigator !== 'undefined' && navigator.onLine ? 'Connected' : 'Offline' },
    { label: '🧠 CPU Cores', value: typeof navigator !== 'undefined' ? `${navigator.hardwareConcurrency || '?'} logical cores` : 'Unknown' },
  ]

  const copySummary = () => {
    const lines = [
      `Public IP: ${data?.ip || 'Unavailable'}`,
      `Location: ${data?.city || ''}, ${data?.country || ''}`,
      `ISP: ${data?.isp || ''}`,
      `Local IPs: ${localIps.join(', ') || 'None detected'}`,
      ...systemInfo.map(s => `${s.label.replace(/^[^\s]+\s*/, '')}: ${s.value}`),
    ]
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {})
    toast.success('Copied network & system info!')
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Network & System Inspector</h2>
        <Button onClick={copySummary} variant="glass" size="sm">📋 Copy All</Button>
      </div>

      {loading ? (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            ⏳ Looking up network details...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : data && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">🌐 Public IP</span>
              <Badge className="text-base px-3 py-1 font-mono">{data.ip}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['📍 Location', [data.city, data.region, data.country].filter(Boolean).join(', ') || 'Unknown'],
                ['🏢 ISP', data.isp || data.org || 'Unknown'],
                ['🌍 Coordinates', data.lat && data.lon ? `${data.lat}, ${data.lon}` : 'Unknown'],
                ['🕐 Timezone', data.timezone || 'Unknown'],
              ].map(([label, value]) => (
                <div key={label} className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="font-medium text-sm truncate">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <p className="text-sm font-semibold">🖥️ Local Network IPs</p>
          {localIps.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {localIps.map(ip => <Badge key={ip} variant="secondary" className="font-mono">{ip}</Badge>)}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No local network interfaces reported by WebRTC</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <p className="text-sm font-semibold">💻 System & Client Environment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {systemInfo.map(i => (
              <div key={i.label} className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{i.label}</span>
                <span className="text-xs font-mono font-medium">{i.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
