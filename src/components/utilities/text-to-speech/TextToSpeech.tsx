import { useState, useCallback, useEffect } from 'react'
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

  const loadVoices = useCallback(() => {
    const v = speechSynthesis.getVoices()
    if (v.length) {
      setVoices(v)
      if (!selectedVoice) setSelectedVoice(v[0].name)
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
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">Text to Speech</Badge>
        <Button onClick={speak} disabled={speaking || !text} size="sm">
          {speaking ? '🔊 Speaking...' : '🔊 Speak'}
        </Button>
        {speaking && <Button onClick={stop} variant="outline" size="sm">⏹️ Stop</Button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Voice</Label>
          <Select
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            options={voices.map(v => ({ value: v.name, label: `${v.name} (${v.lang})` }))}
          />
        </div>
        <div>
          <Label>Rate: {rate}x</Label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" aria-label="Speech rate" />
        </div>
      </div>

      <div>
        <Label>Text</Label>
        <Textarea value={text} onChange={e => setText(e.target.value)} rows={8} />
      </div>
    </div>
  )
}
