import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function createDeck(): string[] {
  const deck: string[] = []
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`)
    }
  }
  return deck
}

function shuffle(arr: string[]): string[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const handRanks: Record<string, number> = {
  'Royal Flush': 10, 'Straight Flush': 9, 'Four of a Kind': 8, 'Full House': 7,
  'Flush': 6, 'Straight': 5, 'Three of a Kind': 4, 'Two Pair': 3, 'One Pair': 2, 'High Card': 1,
}

function evaluateHand(hand: string[]): string {
  const rs = hand.map(c => c.slice(0, -1))
  const ss = hand.map(c => c.slice(-1))
  const rankVals = rs.map(r => ranks.indexOf(r)).sort((a, b) => b - a)
  const isFlush = ss.every(s => s === ss[0])
  const isStraight = rankVals.every((v, i) => i === 0 || rankVals[i - 1] - v === 1) || (rankVals[0] === 12 && rankVals[4] === 0)
  const counts = rankVals.map(v => rankVals.filter(x => x === v).length)
  const has4 = counts.includes(4)
  const has3 = counts.includes(3)
  const pairCount = counts.filter(c => c === 2).length / 2

  if (isFlush && isStraight && rankVals[0] === 12) return 'Royal Flush'
  if (isFlush && isStraight) return 'Straight Flush'
  if (has4) return 'Four of a Kind'
  if (has3 && pairCount >= 1) return 'Full House'
  if (isFlush) return 'Flush'
  if (isStraight) return 'Straight'
  if (has3) return 'Three of a Kind'
  if (pairCount >= 2) return 'Two Pair'
  if (pairCount >= 1) return 'One Pair'
  return 'High Card'
}

export function CardShuffler() {
  const [deck, setDeck] = useState(() => shuffle(createDeck()))
  const [hand, setHand] = useState<string[]>([])
  const [drawnCount, setDrawnCount] = useState(5)

  const doShuffle = () => {
    setDeck(shuffle(createDeck()))
    setHand([])
    toast.success('Deck shuffled!')
  }

  const draw = () => {
    if (deck.length < drawnCount) { toast.error('Not enough cards'); return }
    const drawn = deck.slice(0, drawnCount)
    setHand(drawn)
    setDeck(d => d.slice(drawnCount))
  }

  const reset = () => {
    setDeck(shuffle(createDeck()))
    setHand([])
  }

  const handRank = useMemo(() => hand.length === 5 ? evaluateHand(hand) : '', [hand])

  const suitColor = (card: string) => {
    const suit = card.slice(-1)
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary">{deck.length} cards left</Badge>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Draw:</span>
          {[1, 3, 5, 7].map(n => (
            <button key={n} onClick={() => setDrawnCount(n)}
              className={`px-2 py-1 text-xs rounded border ${drawnCount === n ? 'bg-primary text-primary-foreground' : 'bg-white/30 dark:bg-white/5'}`}>{n}</button>
          ))}
        </div>
        <Button onClick={draw} disabled={deck.length < drawnCount} size="sm">🃏 Draw</Button>
        <Button onClick={doShuffle} variant="outline" size="sm">🔀 Shuffle</Button>
        <Button onClick={reset} variant="outline" size="sm">↺ Reset</Button>
      </div>

      {hand.length > 0 && (
        <div>
          <div className="flex gap-2 flex-wrap justify-center">
            {hand.map((card, i) => (
              <div key={i} className={`w-16 h-24 rounded-lg border-2 bg-white dark:bg-white/10 flex items-center justify-center text-lg font-bold shadow-sm ${suitColor(card)}`}>
                {card}
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Badge variant="secondary" className="text-sm">{handRank}</Badge>
          </div>
        </div>
      )}

      {hand.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          Draw cards from a shuffled deck
        </div>
      )}
    </div>
  )
}
