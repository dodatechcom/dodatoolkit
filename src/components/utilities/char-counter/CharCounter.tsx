import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export function CharCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text ? text.split('\n').length : 0
    const sentences = text ? text.split(/[.!?]+/).filter(Boolean).length : 0
    const paragraphs = text ? text.split(/\n\s*\n/).filter(Boolean).length : 0
    const spaces = (text.match(/\s/g) || []).length
    const letters = (text.match(/[a-zA-Z]/g) || []).length
    const numbers = (text.match(/[0-9]/g) || []).length
    return { chars, charsNoSpace, words, lines, sentences, paragraphs, spaces, letters, numbers }
  }, [text])

  const items = [
    { label: 'Characters', value: stats.chars, color: 'from-indigo-500 to-purple-600' },
    { label: 'No Space', value: stats.charsNoSpace, color: 'from-purple-500 to-pink-600' },
    { label: 'Words', value: stats.words, color: 'from-emerald-500 to-teal-600' },
    { label: 'Lines', value: stats.lines, color: 'from-amber-500 to-orange-600' },
    { label: 'Sentences', value: stats.sentences, color: 'from-pink-500 to-rose-600' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'from-cyan-500 to-blue-600' },
    { label: 'Spaces', value: stats.spaces, color: 'from-sky-500 to-indigo-600' },
    { label: 'Letters', value: stats.letters, color: 'from-green-500 to-emerald-600' },
    { label: 'Numbers', value: stats.numbers, color: 'from-orange-500 to-red-600' },
  ]

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <label className="text-sm font-medium">Type or paste text</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-4 bg-gradient-to-br ${item.color} text-white shadow-lg`}
          >
            <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
            <p className="text-xs opacity-80 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
