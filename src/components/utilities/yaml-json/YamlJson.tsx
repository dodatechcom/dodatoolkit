import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import * as yaml from 'js-yaml'

const sampleJson = JSON.stringify({
  name: 'Doda Toolkit',
  version: '1.0.0',
  features: ['qr-code', 'json-formatter', 'uuid-generator'],
  config: { theme: 'light', lang: 'en' },
}, null, 2)

const sampleYaml = `name: Doda Toolkit
version: '1.0.0'
features:
  - qr-code
  - json-formatter
  - uuid-generator
config:
  theme: light
  lang: en
`

export function YamlJson() {
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml')
  const [input, setInput] = useState(sampleJson)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        setOutput(yaml.dump(parsed, { indent: 2 }))
      } else {
        const parsed = yaml.load(input)
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const swapMode = () => {
    setMode(m => m === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml')
    setInput(output || (mode === 'json-to-yaml' ? sampleYaml : sampleJson))
    setOutput('')
    setError('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() => toast.success('Copied to clipboard'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary" className="text-sm">
          {mode === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
        </Badge>
        <Button onClick={swapMode} variant="outline" size="sm">
          🔄 Swap Direction
        </Button>
        <Button onClick={convert} size="sm">
          ⚡ Convert
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}</Label>
          <Textarea
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            rows={12}
            className="font-mono text-sm"
            placeholder={mode === 'json-to-yaml' ? 'Paste JSON here...' : 'Paste YAML here...'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>{mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}</Label>
            {output && (
              <button onClick={copyOutput} className="text-xs text-muted-foreground hover:text-foreground">
                📋 Copy
              </button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            rows={12}
            className="font-mono text-sm"
            placeholder="Output will appear here..."
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
