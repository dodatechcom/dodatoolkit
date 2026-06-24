import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const statuses = [
  { code: 100, name: 'Continue', cat: '1xx', desc: 'Server has received the request headers and the client should proceed.' },
  { code: 101, name: 'Switching Protocols', cat: '1xx', desc: 'Server is switching protocols as requested.' },
  { code: 200, name: 'OK', cat: '2xx', desc: 'Request succeeded.' },
  { code: 201, name: 'Created', cat: '2xx', desc: 'Request succeeded and a new resource was created.' },
  { code: 204, name: 'No Content', cat: '2xx', desc: 'Request succeeded but no content to return.' },
  { code: 301, name: 'Moved Permanently', cat: '3xx', desc: 'Resource has been permanently moved.' },
  { code: 302, name: 'Found', cat: '3xx', desc: 'Resource temporarily located elsewhere.' },
  { code: 304, name: 'Not Modified', cat: '3xx', desc: 'Resource has not been modified since last request.' },
  { code: 400, name: 'Bad Request', cat: '4xx', desc: 'Server cannot process request due to client error.' },
  { code: 401, name: 'Unauthorized', cat: '4xx', desc: 'Authentication is required.' },
  { code: 403, name: 'Forbidden', cat: '4xx', desc: 'Server understood but refuses to authorize.' },
  { code: 404, name: 'Not Found', cat: '4xx', desc: 'Requested resource could not be found.' },
  { code: 405, name: 'Method Not Allowed', cat: '4xx', desc: 'HTTP method not supported for this resource.' },
  { code: 408, name: 'Request Timeout', cat: '4xx', desc: 'Server timed out waiting for request.' },
  { code: 409, name: 'Conflict', cat: '4xx', desc: 'Request conflicts with current server state.' },
  { code: 422, name: 'Unprocessable Entity', cat: '4xx', desc: 'Request semantic errors.' },
  { code: 429, name: 'Too Many Requests', cat: '4xx', desc: 'Rate limit exceeded.' },
  { code: 500, name: 'Internal Server Error', cat: '5xx', desc: 'Server encountered an unexpected condition.' },
  { code: 502, name: 'Bad Gateway', cat: '5xx', desc: 'Server received invalid upstream response.' },
  { code: 503, name: 'Service Unavailable', cat: '5xx', desc: 'Server temporarily unavailable.' },
  { code: 504, name: 'Gateway Timeout', cat: '5xx', desc: 'Upstream server timed out.' },
]

const catColors: Record<string, string> = {
  '1xx': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '2xx': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  '3xx': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  '4xx': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  '5xx': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function HttpStatus() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return statuses
    const q = search.toLowerCase()
    return statuses.filter(s =>
      s.code.toString().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search by code, name, or description..."
        className="max-w-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(s => (
          <Card key={s.code} className="bg-white/40 dark:bg-white/5 hover:shadow-md transition-shadow">
            <CardContent className="p-3 flex items-start gap-3">
              <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${catColors[s.cat]}`}>
                {s.code}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} of {statuses.length} status codes</p>
    </div>
  )
}