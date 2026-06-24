import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function execWithTimeout(re: RegExp, text: string, timeoutMs = 1000): { full: string; groups: string[]; index: number }[] {
  const results: { full: string; groups: string[]; index: number }[] = []
  let m: RegExpExecArray | null
  const start = Date.now()
  while ((m = re.exec(text)) !== null) {
    results.push({ full: m[0], groups: m.slice(1), index: m.index })
    if (!re.global) break
    if (Date.now() - start > timeoutMs) {
      results.push({ full: '[Timeout: regex took too long]', groups: [], index: -1 })
      break
    }
  }
  return results
}

export function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('john@example.com\njane@test.org\nnot-an-email')

  const regex = useMemo(() => {
    try {
      return { ok: true as const, re: new RegExp(pattern, flags) }
    } catch (e) {
      return { ok: false as const, error: (e as Error).message }
    }
  }, [pattern, flags])

  const matches = useMemo(() => {
    if (!regex.ok) return []
    try {
      return execWithTimeout(regex.re, text)
    } catch {
      return []
    }
  }, [regex, text])

  const highlighted = useMemo(() => {
    if (!regex.ok || !pattern) return text
    try {
      const re = new RegExp(`(${pattern})`, flags.includes('g') ? flags : 'g' + (flags.includes('g') ? '' : ''))
      const escaped = text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)
      return escaped.replace(re, '<mark class="bg-yellow-300/60 dark:bg-yellow-500/30 rounded px-0.5">$1</mark>')
    } catch {
      return text
    }
  }, [text, pattern, flags, regex.ok])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label>Regular Expression</Label>
          <Input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="font-mono"
          />
          {!regex.ok && (
            <p className="text-red-500 text-xs mt-1">{regex.error}</p>
          )}
        </div>
        <div>
          <Label>Flags</Label>
          <Input
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="g, i, m, s, u, y"
            className="font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Test Text</Label>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <div
            className="mt-2 p-3 rounded-lg bg-white/50 dark:bg-white/5 font-mono text-sm whitespace-pre-wrap border"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
        <div>
          <Label>Matches ({matches.length})</Label>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {matches.length === 0 ? (
              <p className="text-muted-foreground text-sm">No matches</p>
            ) : (
              matches.map((m, i) => (
                <Card key={i} className="bg-white/40 dark:bg-white/5">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">#{i + 1}</Badge>
                      <span className="text-xs text-muted-foreground">pos {m.index}</span>
                    </div>
                    <code className="text-sm font-mono bg-green-100 dark:bg-green-900/30 px-1 rounded">
                      {m.full}
                    </code>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {m.groups.map((g, j) => (
                          <Badge key={j} variant="outline" className="text-xs font-mono">
                            ${j + 1}: {g}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {regex.ok && pattern && (
        <div className="text-xs text-muted-foreground font-mono">
          /{pattern}/{flags}
        </div>
      )}
    </div>
  )
}
