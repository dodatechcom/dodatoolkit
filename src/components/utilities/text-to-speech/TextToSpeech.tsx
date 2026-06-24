import { useState, useCallback, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import toast from 'react-hot-toast'

export function TextToSpeech() {
  const [text, setText] = useState('Hello! Welcome to Doda Toolkit. This text will be read aloud.')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1)
  const [speaking, setSpeaking] = useState(false)
  const [noVoice, setNoVoice] = useState(false)
  const retries = useRef(0)

  const loadVoices = useCallback(() => {
    const v = speechSynthesis.getVoices()
    if (v.length) {
      setVoices(v)
      setNoVoice(false)
      if (!selectedVoice || !v.find(vv => vv.name === selectedVoice)) {
        setSelectedVoice(v[0].name)
      }
    } else if (retries.current < 10) {
      retries.current++
      setTimeout(loadVoices, 300)
    } else {
      setNoVoice(true)
    }
  }, [selectedVoice])

  useEffect(() => {
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
    return () => { speechSynthesis.onvoiceschanged = null }
  }, [loadVoices])

  const speak = () => {
    if (!text) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => { setSpeaking(false); toast.error('Speech error') }
    window.speechSynthesis.speak(utter)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 border-sky-200 dark:border-sky-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">Text to Speech</Badge>
            <Button onClick={speak} disabled={speaking || !text} size="sm">
              {speaking ? '🔊 Speaking...' : '🔊 Speak'}
            </Button>
            {speaking && <Button onClick={stop} variant="outline" size="sm">⏹️ Stop</Button>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/40 dark:bg-white/5 border-border/50">
          <CardContent className="p-4">
            <Label>Voice</Label>
            {noVoice ? (
              <p className="text-xs text-muted-foreground mt-1">No voices available on this system/browser</p>
            ) : voices.length === 0 ? (
              <p className="text-xs text-muted-foreground mt-1">Loading voices...</p>
            ) : (
              <Select
                value={selectedVoice}
                onChange={e => setSelectedVoice(e.target.value)}
                options={voices.map(v => ({ value: v.name, label: `${v.name} (${v.lang})` }))}
              />
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-white/5 border-border/50">
          <CardContent className="p-4">
            <Label>Rate: {rate}x</Label>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full mt-1.5" aria-label="Speech rate" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/40 dark:bg-white/5 border-border/50">
        <CardContent className="p-4">
          <Label>Text</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="mt-1.5" />
        </CardContent>
      </Card>
    </div>
  )
}
