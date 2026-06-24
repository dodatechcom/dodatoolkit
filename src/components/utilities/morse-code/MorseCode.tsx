import { useState, useMemo, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const morseMap: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
  'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
  'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
  'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', ':': '---...',
  ';': '-.-.-.', "'": '.----.', '"': '.-..-.', '(': '-.--.', ')': '-.--.-',
  ' ': '/',
}

const reverseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(ch => morseMap[ch] || ch).join(' ')
}

function morseToText(morse: string): string {
  return morse.split(' ').map(code => reverseMap[code] || code).join('')
}

export function MorseCode() {
  const [input, setInput] = useState('SOS')
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse')
  const audioCtxRef = useRef<AudioContext | null>(null)

  const output = useMemo(() => {
    if (mode === 'text-to-morse') return textToMorse(input)
    return morseToText(input)
  }, [input, mode])

  const swap = () => {
    setMode(m => m === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse')
    setInput(output)
  }

  const play = () => {
    if (audioCtxRef.current) audioCtxRef.current.close()
    const audioCtx = new AudioContext()
    audioCtxRef.current = audioCtx
    const dot = 0.12
    const gap = 0.05
    const freq = 700
    const morse = mode === 'text-to-morse' ? output : input
    let time = 0
    for (const ch of morse) {
      if (ch === '.') { playTone(audioCtx, dot, freq, time); time += dot + gap }
      else if (ch === '-') { playTone(audioCtx, dot * 3, freq, time); time += dot * 3 + gap }
      else if (ch === ' ') time += dot * 2
    }
    const maxTime = (time + 1) * 1000
    setTimeout(() => { if (audioCtxRef.current === audioCtx) audioCtx.close() }, maxTime)
  }

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => toast.success('Copied'), () => toast.error('Copy failed'))
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">{mode === 'text-to-morse' ? 'Text → Morse' : 'Morse → Text'}</Badge>
            <Button onClick={swap} variant="outline" size="sm">🔄 Swap</Button>
            {mode === 'text-to-morse' && <Button onClick={play} variant="outline" size="sm">🔊 Play Morse</Button>}
            <Button onClick={copy} variant="outline" size="sm">📋 Copy</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/40 dark:bg-white/5 border-border/50">
        <CardContent className="p-4">
          <Label>{mode === 'text-to-morse' ? 'Text' : 'Morse Code'}</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="font-mono text-sm mt-1.5" />
        </CardContent>
      </Card>
      <Card className="bg-white/40 dark:bg-white/5 border-border/50">
        <CardContent className="p-4">
          <Label>{mode === 'text-to-morse' ? 'Morse Code' : 'Text'}</Label>
          <Textarea value={output} readOnly rows={6} className="font-mono text-sm mt-1.5" />
        </CardContent>
      </Card>
    </div>
  )
}

function playTone(ctx: AudioContext, duration: number, freq: number, offset: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = 0.3
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(ctx.currentTime + offset)
  osc.stop(ctx.currentTime + offset + duration)
}
