import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

function encodeEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

function decodeEntities(str: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = str
  return textarea.value
}

export function HTMLEntityEncoder() {
  const [input, setInput] = useState('<div class="hello">Hello & World</div>')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  function handleEncode() {
    setOutput(encodeEntities(input))
    setMode('encode')
  }

  function handleDecode() {
    setOutput(decodeEntities(input))
    setMode('decode')
  }

  function swap() {
    setInput(output)
    setOutput('')
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <label className="text-sm font-medium">
            {mode === 'encode' ? 'HTML Input' : 'Encoded Input'}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<div>Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'}
            className="min-h-[120px] font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleEncode} variant="glass" size="sm">🔒 Encode</Button>
            <Button onClick={handleDecode} variant="glass" size="sm">🔓 Decode</Button>
            {input && output && <Button onClick={swap} variant="outline" size="sm">🔄 Swap</Button>}
            <Button onClick={() => { setInput(''); setOutput('') }} variant="ghost" size="sm">Clear</Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
              </span>
              <Button onClick={copy} variant="ghost" size="sm">📋 Copy</Button>
            </div>
            <Textarea value={output} readOnly className="min-h-[120px] font-mono text-sm break-all" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
