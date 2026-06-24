import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const quotes = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it’s bad.', author: 'Cory House' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama' },
  { text: 'Get busy living or get busy dying.', author: 'Stephen King' },
  { text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { text: 'Whether you think you can or you think you can’t, you’re right.', author: 'Henry Ford' },
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'Nothing is impossible, the word itself says I’m possible!', author: 'Audrey Hepburn' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { text: 'Everything you’ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Believe you can and you’re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
]

export function RandomQuote() {
  const [quote, setQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])

  const next = () => {
    let q: typeof quote
    do { q = quotes[Math.floor(Math.random() * quotes.length)] } while (q.text === quote.text)
    setQuote(q)
  }

  const copy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`).catch(() => {})
    toast.success('Copied')
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">💡</div>
          <div className="text-xl italic font-medium leading-relaxed">"{quote.text}"</div>
          <div className="mt-4 text-sm text-muted-foreground">— {quote.author}</div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-3">
        <Button onClick={next} size="lg">🎲 Next Quote</Button>
        <Button onClick={copy} variant="outline" size="lg">📋 Copy</Button>
      </div>
    </div>
  )
}
