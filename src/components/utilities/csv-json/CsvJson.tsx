import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n').map(l => {
    const parts: string[] = []
    let current = '', inQuotes = false
    for (let i = 0; i < l.length; i++) {
      const ch = l[i]
      if (ch === '"') {
        if (inQuotes && i + 1 < l.length && l[i + 1] === '"') {
          current += '"'; i++
        } else {
          inQuotes = !inQuotes
        }
        continue
      }
      if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue }
      current += ch
    }
    parts.push(current.trim())
    return parts
  })
  if (lines.length < 2) return []
  const headers = lines[0]
  return lines.slice(1).map(row => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = row[i] || '' })
    return obj
  })
}

function toCSV(arr: Record<string, string>[]): string {
  if (!arr.length) return ''
  const headers = Object.keys(arr[0])
  const lines = [headers.join(',')]
  for (const row of arr) {
    lines.push(headers.map(h => {
      const v = row[h] || ''
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v
    }).join(','))
  }
  return lines.join('\n')
}

const sampleJson = JSON.stringify([
  { name: 'Alice', age: '30', city: 'NYC' },
  { name: 'Bob', age: '25', city: 'LA' },
], null, 2)
const sampleCsv = 'name,age,city\nAlice,30,NYC\nBob,25,LA'

export function CsvJson() {
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [input, setInput] = useState(sampleCsv)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      if (mode === 'csv-to-json') {
        const arr = parseCSV(input)
        setOutput(JSON.stringify(arr, null, 2))
        if (!arr.length) setError('No data found')
      } else {
        const parsed = JSON.parse(input)
        setOutput(toCSV(parsed))
      }
    } catch (e) { setError((e as Error).message) }
  }

  const swap = () => {
    setMode(m => m === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')
    setInput(output || (mode === 'csv-to-json' ? sampleJson : sampleCsv))
    setOutput(''); setError('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() => toast.success('Copied'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">{mode === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'}</Badge>
        <Button onClick={swap} variant="outline" size="sm">🔄 Swap</Button>
        <Button onClick={convert} size="sm">⚡ Convert</Button>
        {output && <Button onClick={copyOutput} variant="outline" size="sm">📋 Copy</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</Label>
          <Textarea value={input} onChange={e => { setInput(e.target.value); setError('') }} rows={12} className="font-mono text-sm" />
        </div>
        <div>
          <Label>{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</Label>
          <Textarea value={output} readOnly rows={12} className="font-mono text-sm" />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
