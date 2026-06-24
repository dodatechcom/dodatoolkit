import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
          setData({ ip: d.query, city: d.city || '', region: d.region || '', country: d.country || '', org: d.org || '', lat: d.lat, lon: d.lon, timezone: d.timezone || '', isp: d.isp || '' })
        } else {
          setError('Could not retrieve IP information')
        }
      })
      .catch(() => setError('Network error or API unreachable'))
      .finally(() => { setLoading(false); clearTimeout(timeout) })

    return () => { clearTimeout(timeout); controller.abort() }
  }, [])

  useEffect(() => {
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
  }, [])

  if (loading) return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">⏳ Looking up your IP...</div>

  if (error) return (
    <div className="space-y-4 max-w-lg">
      <div className="text-center text-muted-foreground py-8 text-sm">{error}</div>
      <Card>
        <CardContent className="p-5 space-y-2">
          <p className="text-sm font-semibold">🖥️ Local IPs</p>
          {localIps.length > 0 ? (
            <div className="flex flex-wrap gap-2">{localIps.map(ip => <Badge key={ip} variant="secondary">{ip}</Badge>)}</div>
          ) : <p className="text-sm text-muted-foreground">Could not detect local IPs</p>}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-4 max-w-lg">
      {data && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">🌐 Public IP</span>
              <Badge className="text-base px-3 py-1">{data.ip}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['📍 Location', data.city || data.region || data.country ? `${data.city}${data.city && data.region ? ', ' : ''}${data.region}${(data.city || data.region) && data.country ? ', ' : ''}${data.country}` : 'Unknown'],
                ['🏢 ISP', data.isp || data.org || 'Unknown'],
                ['🌍 Coordinates', data.lat && data.lon ? `${data.lat}, ${data.lon}` : 'Unknown'],
                ['🕐 Timezone', data.timezone || 'Unknown'],
              ].map(([label, value]) => (
                <div key={label} className="p-2 rounded-lg bg-white/40 dark:bg-white/5">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="font-medium truncate">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5 space-y-2">
          <p className="text-sm font-semibold">🖥️ Local IPs</p>
          {localIps.length > 0 ? (
            <div className="flex flex-wrap gap-2">{localIps.map(ip => <Badge key={ip} variant="secondary">{ip}</Badge>)}</div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not detect local IPs</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
