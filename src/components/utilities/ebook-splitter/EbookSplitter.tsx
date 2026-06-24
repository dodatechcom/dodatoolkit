import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Chapter {
  index: number
  title: string
  content: string
}

function splitIntoChapters(text: string): Chapter[] {
  const lines = text.split('\n')
  const chapters: Chapter[] = []
  let current: string[] = []
  let currentTitle = 'Preamble'
  let chapterIndex = 0

  const chapterRegex = /^(#{1,6}\s+|第[一二三四五六七八九十百千\d]+[章节部]|Chapter\s+\d+|Part\s+\d+|§\s*\d+)/i

  for (const line of lines) {
    if (chapterRegex.test(line.trim())) {
      if (current.length > 0 || chapters.length > 0) {
        chapters.push({ index: chapterIndex++, title: currentTitle, content: current.join('\n').trim() })
      }
      currentTitle = line.trim().replace(/^#+\s*/, '')
      current = []
    } else {
      current.push(line)
    }
  }

  if (current.length > 0 || chapters.length === 0) {
    chapters.push({ index: chapterIndex, title: currentTitle, content: current.join('\n').trim() })
  }

  return chapters.filter(ch => ch.content.length > 0)
}

export function EbookSplitter() {
  const [input, setInput] = useState(`# Chapter 1: The Beginning

It was a dark and stormy night. The wind howled through the trees as our hero stood at the edge of the forest.

Little did he know, this was only the beginning of an extraordinary journey.

# Chapter 2: The Discovery

Deep within the cave, a faint glow emanated from an ancient artifact. It pulsed with an energy that seemed to call out to him.

His hands trembled as he reached out to touch it.

# Chapter 3: The Transformation

The moment his fingers made contact, a surge of power rushed through his body. He could feel the world changing around him, reality bending to his will.

Nothing would ever be the same again.`)

  const chapters = useMemo(() => splitIntoChapters(input), [input])

  const downloadAll = () => {
    chapters.forEach(ch => {
      const blob = new Blob([`# ${ch.title}\n\n${ch.content}`], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ch.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    })
    toast.success(`Downloaded ${chapters.length} chapters`)
  }

  const copyChapter = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    toast.success('Chapter copied')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{chapters.length} chapters found</Badge>
        {chapters.length > 1 && (
          <Button onClick={downloadAll} size="sm">📥 Download All Chapters</Button>
        )}
      </div>

      <div>
        <Label>Ebook Text</Label>
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={10}
          className="font-mono text-sm"
          placeholder="Paste ebook text with chapter headings..."
        />
      </div>

      {chapters.length === 0 && (
        <div className="text-center text-muted-foreground py-8 text-sm">
          No chapters detected. Make sure your text has chapter headings.
        </div>
      )}

      <div className="space-y-3">
        {chapters.map(ch => (
          <Card key={ch.index} className="border-l-4 border-l-primary/40">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-muted-foreground">#{ch.index + 1}</span>
                  <h3 className="font-semibold">{ch.title}</h3>
                </div>
                <button onClick={() => copyChapter(`# ${ch.title}\n\n${ch.content}`)} className="p-1.5 rounded-lg hover:bg-secondary text-xs shrink-0" title="Copy chapter">📋</button>
              </div>
              <pre className="mt-2 text-sm whitespace-pre-wrap line-clamp-4 text-muted-foreground">{ch.content}</pre>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{ch.content.length} chars</Badge>
                <span className="text-[10px] text-muted-foreground">{ch.content.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
