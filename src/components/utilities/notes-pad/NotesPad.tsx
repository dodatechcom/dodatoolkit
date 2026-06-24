import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'doda-notes'

export function NotesPad() {
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
  })
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, notes)
      setLastSaved(new Date().toLocaleTimeString())
    }, 500)
    return () => clearTimeout(id)
  }, [notes])

  const clear = () => {
    setNotes('')
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Notes cleared')
  }

  const copy = () => {
    navigator.clipboard.writeText(notes).catch(() => {})
    toast.success('Copied to clipboard')
  }

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
  const charCount = notes.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">📝 Notes</Badge>
        <span className="text-xs text-muted-foreground">{wordCount} words · {charCount} chars</span>
        {lastSaved && <span className="text-xs text-muted-foreground">Saved at {lastSaved}</span>}
        <div className="flex-1" />
        <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>
        <Button onClick={clear} variant="outline" size="sm" className="text-red-500 hover:text-red-600">🗑️ Clear</Button>
      </div>

      <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={16}
        className="font-mono text-sm"
        placeholder="Start typing your notes here... They are auto-saved to your browser."
      />
    </div>
  )
}