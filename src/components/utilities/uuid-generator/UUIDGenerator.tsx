import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return Array.from(bytes).map((b, i) => b.toString(16).padStart(2, '0') + (i === 3 || i === 5 || i === 7 || i === 9 ? '-' : '')).join('')
}

function generateUUIDv7(): string {
  const timestamp = Date.now()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[0] = (timestamp >> 40) & 0xff
  bytes[1] = (timestamp >> 32) & 0xff
  bytes[2] = (timestamp >> 24) & 0xff
  bytes[3] = (timestamp >> 16) & 0xff
  bytes[4] = (timestamp >> 8) & 0xff
  bytes[5] = timestamp & 0xff
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return Array.from(bytes).map((b, i) => b.toString(16).padStart(2, '0') + (i === 3 || i === 5 || i === 7 || i === 9 ? '-' : '')).join('')
}

export function UUIDGenerator() {
  const [count, setCount] = useState('5')
  const [version, setVersion] = useState('v4')
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100)
    const fn = version === 'v4' ? generateUUIDv4 : generateUUIDv7
    setUuids(Array.from({ length: n }, () => fn()))
  }, [count, version])

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n')).then(
      () => toast.success(`Copied ${uuids.length} UUIDs!`),
      () => toast.error('Copy failed')
    )
  }

  function copyOne(uuid: string) {
    navigator.clipboard.writeText(uuid).then(() => toast.success('Copied!'), () => toast.error('Copy failed'))
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label>Version</Label>
              <Select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                options={[
                  { value: 'v4', label: 'UUID v4 (Random)' },
                  { value: 'v7', label: 'UUID v7 (Time-ordered)' },
                ]}
              />
            </div>
            <div className="space-y-2 w-24">
              <Label>Count</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <Button onClick={generate} variant="glass" size="lg">
              ⚡ Generate
            </Button>
            {uuids.length > 0 && (
              <Button onClick={copyAll} variant="outline" size="lg">
                📋 Copy All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {uuids.length > 0 && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{uuids.length} UUID{uuids.length > 1 ? 's' : ''} generated</Badge>
            </div>
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => copyOne(uuid)}
              >
                <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                <code className="flex-1 font-mono text-sm">{uuid}</code>
                <span className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground transition-opacity">
                  📋
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
