import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const controlNames: Record<number, string> = {
  0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
  8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
  16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB',
  24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US',
  127: 'DEL',
}

export function AsciiTable() {
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const data = Array.from({ length: 128 }, (_, i) => ({
      dec: i, hex: i.toString(16).toUpperCase().padStart(2, '0'),
      bin: i.toString(2).padStart(8, '0'),
      char: i >= 32 && i <= 126 ? String.fromCharCode(i) : '',
      desc: controlNames[i] || (i === 32 ? 'SP' : i === 127 ? 'DEL' : ''),
    }))
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(r =>
      r.dec.toString().includes(q) || r.hex.includes(q.toUpperCase()) ||
      r.bin.includes(q) || r.char.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-4">
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by decimal, hex, binary, char, or description..." className="max-w-lg" />

      <div className="overflow-x-auto rounded-lg border max-h-[500px] overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <tr className="border-b">
              {['Dec', 'Hex', 'Binary', 'Char', 'Description'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.dec} className="border-t border-white/10 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                <td className="px-3 py-1.5">{r.dec}</td>
                <td className="px-3 py-1.5 text-indigo-500 font-bold">0x{r.hex}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{r.bin}</td>
                <td className="px-3 py-1.5 text-lg">{r.char || <span className="text-muted-foreground text-xs">␀</span>}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{r.desc || <span className="text-[10px]">printable</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">{rows.length} of 128 characters</p>
    </div>
  )
}
