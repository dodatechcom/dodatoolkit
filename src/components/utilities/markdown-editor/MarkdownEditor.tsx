import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import toast from 'react-hot-toast'

const initialMd = `# Hello Doda! 🎉

## Markdown Features

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`

### Code Block
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### List
1. First item
2. Second item
3. Third item

### Blockquote
> This is a quote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

[Link](https://doda.toolkit) and ![Image](https://placehold.co/400x100)
`

export function MarkdownEditor() {
  const [source, setSource] = useState(initialMd)
  const [splitView, setSplitView] = useState(true)

  const html = useMemo(() => {
    const raw = marked.parse(source) as string
    return DOMPurify.sanitize(raw)
  }, [source])

  const copyHtml = () => {
    navigator.clipboard.writeText(html).catch(() => {})
    toast.success('HTML copied to clipboard')
  }

  const copyMd = () => {
    navigator.clipboard.writeText(source).catch(() => {})
    toast.success('Markdown copied to clipboard')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary" className="text-sm">Markdown</Badge>
        <Button onClick={() => setSplitView(v => !v)} variant="outline" size="sm">
          {splitView ? '📄 Preview Only' : '✍️ Split View'}
        </Button>
        <Button onClick={copyMd} variant="outline" size="sm">
          📋 Copy Markdown
        </Button>
        <Button onClick={copyHtml} variant="outline" size="sm">
          📋 Copy HTML
        </Button>
      </div>

      <div className={`grid ${splitView ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {splitView && (
          <div>
            <Label>Editor</Label>
            <Textarea
              value={source}
              onChange={e => setSource(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          </div>
        )}
        <div>
          <Label>Preview</Label>
          <div className="min-h-[500px] p-4 rounded-lg border bg-white/50 dark:bg-white/5 overflow-auto prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  )
}