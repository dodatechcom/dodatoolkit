import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('formatted')

  const formatJSON = useCallback(() => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setMode('formatted')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input])

  const minifyJSON = useCallback(() => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setMode('minified')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input])

  const validateJSON = useCallback(() => {
    setError('')
    try {
      JSON.parse(input)
      toast.success('Valid JSON! ✅')
      setOutput('✓ Valid JSON')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input])

  function copyOutput() {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input JSON</label>
            {input && (
              <Badge variant="secondary" className="text-xs">
                {input.length} chars
              </Badge>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={formatJSON} variant="glass" size="sm">
              🎨 Format
            </Button>
            <Button onClick={minifyJSON} variant="glass" size="sm">
              📦 Minify
            </Button>
            <Button onClick={validateJSON} variant="glass" size="sm">
              ✅ Validate
            </Button>
            {input && (
              <Button onClick={() => setInput('')} variant="ghost" size="sm">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 shadow-xl">
          <CardContent className="p-4">
            <p className="text-sm text-destructive font-mono">{error}</p>
          </CardContent>
        </Card>
      )}

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Output</span>
                <Badge variant="secondary" className="text-xs">
                  {mode === 'formatted' ? 'Formatted' : mode === 'minified' ? 'Minified' : 'Validation'}
                </Badge>
              </div>
              <Button onClick={copyOutput} variant="ghost" size="sm">
                📋 Copy
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
