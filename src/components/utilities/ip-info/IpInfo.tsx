import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
  const [localIps, setLocalIps] = useState<string[]>([])

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {
        fetch('https://ip-api.com/json/?fields=query,city,region,country,org,lat,lon,timezone,isp')
          .then(r => r.json())
          .then(d => setData({ ip: d.query, city: d.city, region: d.region, country: d.country, org: d.org, lat: d.lat, lon: d.lon, timezone: d.timezone, isp: d.isp }))
          .catch(() => {})
      })
      .finally(() => setLoading(false))
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

  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {})

  if (loading) return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">⏳ Looking up your IP...</div>

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
                ['📍 Location', `${data.city}, ${data.region}, ${data.country}`],
                ['🏢 ISP', data.isp || data.org],
                ['🌍 Coordinates', `${data.lat}, ${data.lon}`],
                ['🕐 Timezone', data.timezone],
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
            <div className="flex flex-wrap gap-2">
              {localIps.map(ip => <Badge key={ip} variant="secondary">{ip}</Badge>)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not detect local IPs</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
