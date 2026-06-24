import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface ClipItem {
  id: number
  text: string
  time: number
}

function loadHistory(): ClipItem[] {
  try { return JSON.parse(localStorage.getItem('doda-clips') || '[]') } catch { return [] }
}

function saveHistory(items: ClipItem[]) {
  localStorage.setItem('doda-clips', JSON.stringify(items))
}

export function ClipboardManager() {
  const [items, setItems] = useState<ClipItem[]>(loadHistory)
  const [search, setSearch] = useState('')
  const [autoTrack, setAutoTrack] = useState(true)
  const lastClip = useRef('')

  useEffect(() => {
    if (!autoTrack) return
    const id = setInterval(() => {
      navigator.clipboard.readText().then(text => {
        if (text && text !== lastClip.current) {
          lastClip.current = text
          setItems(prev => {
            if (prev.length > 0 && prev[0].text === text) return prev
            const next = [{ id: Date.now(), text, time: Date.now() }, ...prev].slice(0, 100)
            saveHistory(next)
            return next
          })
        }
      }).catch(() => {})
    }, 1000)
    return () => clearInterval(id)
  }, [autoTrack])

  useEffect(() => {
    const handlePaste = () => {
      setTimeout(() => {
        navigator.clipboard.readText().then(text => {
          if (text && text !== lastClip.current) {
            lastClip.current = text
            setItems(prev => {
              if (prev.length > 0 && prev[0].text === text) return prev
              const next = [{ id: Date.now(), text, time: Date.now() }, ...prev].slice(0, 100)
              saveHistory(next)
              return next
            })
          }
        }).catch(() => {})
      }, 100)
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Copied to clipboard')
  }

  const remove = (id: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      saveHistory(next)
      return next
    })
  }

  const clearAll = () => {
    setItems([])
    saveHistory([])
    toast.success('History cleared')
  }

  const filtered = search.trim()
    ? items.filter(i => i.text.toLowerCase().includes(search.toLowerCase()))
    : items

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clipboard history..."
          className="max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={autoTrack} onChange={e => setAutoTrack(e.target.checked)} className="rounded" />
          Auto-track
        </label>
        {items.length > 0 && (
          <Button onClick={clearAll} variant="outline" size="sm">🗑️ Clear All</Button>
        )}
      </div>

      <Badge variant="secondary">{items.length} items stored</Badge>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            {search ? 'No matching items' : 'Clipboard is empty. Copy something to get started.'}
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border hover:bg-accent/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all line-clamp-3">{item.text}</pre>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(item.time).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copy(item.text)} className="p-1.5 rounded-lg hover:bg-secondary text-xs" title="Copy">📋</button>
                <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-xs" title="Delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
