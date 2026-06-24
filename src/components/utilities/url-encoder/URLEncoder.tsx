import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import toast from 'react-hot-toast'

export function URLEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  function encode() {
    try {
      setOutput(encodeURIComponent(input))
    } catch {
      toast.error('Failed to encode')
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input))
    } catch {
      toast.error('Invalid URL-encoded string')
    }
  }

  function encodeFull() {
    try {
      setOutput(encodeURI(input))
    } catch {
      toast.error('Failed to encode')
    }
  }

  function decodeFull() {
    try {
      setOutput(decodeURI(input))
    } catch {
      toast.error('Invalid URL')
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <label className="text-sm font-medium">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or URL..."
            className="min-h-[120px] font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={encode} variant="glass" size="sm">🔒 Encode Component</Button>
            <Button onClick={decode} variant="glass" size="sm">🔓 Decode Component</Button>
            <Button onClick={encodeFull} variant="glass" size="sm">🔒 Encode URL</Button>
            <Button onClick={decodeFull} variant="glass" size="sm">🔓 Decode URL</Button>
            <Button onClick={() => { setInput(''); setOutput('') }} variant="ghost" size="sm">Clear</Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Output</span>
              <Button onClick={copy} variant="ghost" size="sm">📋 Copy</Button>
            </div>
            <Textarea value={output} readOnly className="min-h-[120px] font-mono text-sm break-all" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
