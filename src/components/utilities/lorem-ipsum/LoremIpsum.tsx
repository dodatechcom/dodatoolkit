import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum',
  'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit',
  'anim', 'id', 'est', 'laborum', 'fusce', 'nec', 'tellus', 'sed', 'augue',
  'semper', 'porta', 'mauris', 'massa', 'vestibulum', 'lacinia', 'arcu',
  'eget', 'nullam', 'non', 'nisi', 'est', 'sit', 'amet', 'facilisis', 'magna',
  'etiam', 'tempor', 'orci', 'eu', 'lobortis', 'elementum', 'nibh', 'tellus',
  'molestie', 'nunc', 'non', 'blandit', 'massa', 'enim', 'nec', 'dui', 'nunc',
]

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateParagraph(wordCount: number): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)])
  }
  const sentence = capitalize(words.join(' ')) + '.'
  return sentence
}

function generateText(paragraphs: number, wordsPerParagraph: number): string {
  return Array.from({ length: paragraphs }, () => generateParagraph(wordsPerParagraph)).join('\n\n')
}

export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState('3')
  const [wordsPerPara, setWordsPerPara] = useState('30')
  const [output, setOutput] = useState('')

  function generate() {
    const p = Math.max(1, parseInt(paragraphs) || 1)
    const w = Math.max(5, parseInt(wordsPerPara) || 30)
    setOutput(generateText(p, w))
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {})
    toast.success('Copied!')
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2 w-28">
              <Label>Paragraphs</Label>
              <Input type="number" min="1" max="50" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} />
            </div>
            <div className="space-y-2 w-32">
              <Label>Words per paragraph</Label>
              <Input type="number" min="5" max="200" value={wordsPerPara} onChange={(e) => setWordsPerPara(e.target.value)} />
            </div>
            <Button onClick={generate} variant="glass" size="lg">📝 Generate</Button>
            {output && <Button onClick={copy} variant="outline" size="lg">📋 Copy</Button>}
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="glass border-none shadow-xl">
          <CardContent className="p-6">
            <Textarea value={output} readOnly className="min-h-[250px]" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
