import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'doda-todos'

interface Todo { id: number; text: string; done: boolean }

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Todo[] } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }, [todos])

  const add = () => {
    if (!input.trim()) return
    setTodos(t => [...t, { id: Date.now(), text: input.trim(), done: false }])
    setInput('')
  }

  const toggle = (id: number) => setTodos(t => t.map(td => td.id === id ? { ...td, done: !td.done } : td))
  const remove = (id: number) => setTodos(t => t.filter(td => td.id !== id))
  const clearDone = () => setTodos(t => t.filter(td => !td.done))

  const filtered = filter === 'all' ? todos : filter === 'active' ? todos.filter(t => !t.done) : todos.filter(t => t.done)
  const activeCount = todos.filter(t => !t.done).length

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a task..." className="flex-1" />
        <Button onClick={add} size="sm">➕ Add</Button>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>{todos.length} tasks ({activeCount} active)</span>
        <div className="flex gap-1">
          {(['all', 'active', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-xs rounded ${filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-white/20'}`}>{f}</button>
          ))}
        </div>
        {activeCount < todos.length && <button onClick={clearDone} className="text-xs text-red-500 hover:text-red-600">Clear done</button>}
      </div>

      <div className="space-y-1">
        {filtered.map(td => (
          <div key={td.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
            td.done ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 line-through opacity-60' : 'bg-white/40 dark:bg-white/5'
          }`}>
            <input type="checkbox" checked={td.done} onChange={() => toggle(td.id)} className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
            <span className="flex-1 text-sm">{td.text}</span>
            <button onClick={() => remove(td.id)} className="text-xs text-muted-foreground hover:text-red-500">✕</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>}
      </div>
    </div>
  )
}
