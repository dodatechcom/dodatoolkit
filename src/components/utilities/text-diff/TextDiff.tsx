import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: { type: 'same' | 'added' | 'removed'; text: string }[] = []

  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]
    if (oldLine === undefined && newLine !== undefined) {
      result.push({ type: 'added', text: newLine })
    } else if (newLine === undefined && oldLine !== undefined) {
      result.push({ type: 'removed', text: oldLine })
    } else if (oldLine !== newLine) {
      result.push({ type: 'removed', text: oldLine! })
      result.push({ type: 'added', text: newLine! })
    } else {
      result.push({ type: 'same', text: oldLine! })
    }
  }
  return result
}

export function TextDiff() {
  const [left, setLeft] = useState('Hello World\nThis is line 2\nShared line')
  const [right, setRight] = useState('Hello World\nThis is modified line 2\nShared line\nNew line 4')

  const diff = useMemo(() => computeDiff(left, right), [left, right])

  const stats = useMemo(() => {
    const added = diff.filter((l) => l.type === 'added').length
    const removed = diff.filter((l) => l.type === 'removed').length
    const same = diff.filter((l) => l.type === 'same').length
    return { added, removed, same }
  }, [diff])

  return (
    <div className="max-w-3xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-4">
            <label className="text-sm font-medium block mb-2">Original Text</label>
            <Textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Original text..."
            />
          </CardContent>
        </Card>
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-4">
            <label className="text-sm font-medium block mb-2">Modified Text</label>
            <Textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Modified text..."
            />
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-none shadow-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Diff Result</span>
            <Badge variant="outline" className="text-green-600 border-green-600">+{stats.added} added</Badge>
            <Badge variant="outline" className="text-red-600 border-red-600">-{stats.removed} removed</Badge>
            <Badge variant="outline" className="text-muted-foreground">{stats.same} unchanged</Badge>
          </div>
          <div className="font-mono text-sm rounded-xl overflow-hidden border border-border">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`px-3 py-1 ${
                  line.type === 'added' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                  line.type === 'removed' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                  ''
                }`}
              >
                {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                {line.text || ' '}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
