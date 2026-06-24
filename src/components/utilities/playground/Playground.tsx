import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const defaultHtml = `<div class="container">
  <h1>Hello, Doda!</h1>
  <p>Edit the HTML, CSS, or JS below.</p>
  <button onclick="handleClick()">Click Me</button>
</div>`

const defaultCss = `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 { color: #333; }

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

button:hover { opacity: 0.9; }`

const defaultJs = `function handleClick() {
  alert('Hello from Doda Toolkit! 🧰');
}`

export function Playground() {
  const [html, setHtml] = useState(defaultHtml)
  const [css, setCss] = useState(defaultCss)
  const [js, setJs] = useState(defaultJs)
  const [tab, setTab] = useState<'html' | 'css' | 'js'>('html')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const srcDoc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`

  const codeMap = { html, css, js }
  const setterMap = { html: setHtml, css: setCss, js: setJs }

  const copyCode = () => {
    navigator.clipboard.writeText(codeMap[tab]).catch(() => {})
    toast.success('Code copied')
  }

  const clearAll = () => {
    if (confirm('Clear all code?')) { setHtml(''); setCss(''); setJs('') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(['html', 'css', 'js'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border font-mono uppercase ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-white/40 dark:bg-white/5'}`}>
            {t}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={copyCode} className="text-xs text-muted-foreground hover:text-foreground">📋 Copy</button>
        <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">🗑️ Clear</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{tab.toUpperCase()}</Label>
          <textarea
            value={codeMap[tab]}
            onChange={e => setterMap[tab](e.target.value)}
            className="w-full h-64 rounded-lg border bg-white/40 dark:bg-white/5 font-mono text-sm p-3 resize-none outline-none focus:ring-2 focus:ring-primary/50"
            spellCheck={false}
          />
        </div>
        <div>
          <Label>Preview</Label>
          <iframe ref={iframeRef} srcDoc={srcDoc} className="w-full h-64 rounded-lg border bg-white" title="Preview" />
        </div>
      </div>
    </div>
  )
}
