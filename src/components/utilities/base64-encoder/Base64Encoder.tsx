import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function Base64Encoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  function handleEncode() {
    setError('')
    try {
      setOutput(btoa(input))
      setMode('encode')
    } catch (e) {
      setError('Failed to encode. Check your input.')
      setOutput('')
    }
  }

  function handleDecode() {
    setError('')
    try {
      setOutput(atob(input))
      setMode('decode')
    } catch (e) {
      setError('Invalid Base64 string.')
      setOutput('')
    }
  }

  function swap() {
    setInput(output)
    setOutput('')
    setError('')
  }

  function copyOutput() {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
            </label>
            {input && <Badge variant="secondary">{input.length} chars</Badge>}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleEncode} variant="glass" size="sm">
              🔒 Encode
            </Button>
            <Button onClick={handleDecode} variant="glass" size="sm">
              🔓 Decode
            </Button>
            {input && output && (
              <Button onClick={swap} variant="outline" size="sm">
                🔄 Swap
              </Button>
            )}
            {input && (
              <Button onClick={() => { setInput(''); setOutput(''); setError('') }} variant="ghost" size="sm">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 shadow-xl">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output</label>
              <Button onClick={copyOutput} variant="ghost" size="sm">📋 Copy</Button>
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[150px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
