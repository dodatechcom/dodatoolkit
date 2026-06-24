import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const categories: Record<string, { emoji: string; name: string }[]> = {
  'Smileys': [
    { emoji: '😀', name: 'Grinning' }, { emoji: '😂', name: 'Joy' }, { emoji: '🥹', name: 'Tears' },
    { emoji: '😍', name: 'Heart Eyes' }, { emoji: '🤩', name: 'Star Struck' }, { emoji: '😎', name: 'Cool' },
    { emoji: '🤔', name: 'Thinking' }, { emoji: '😴', name: 'Sleeping' }, { emoji: '🤗', name: 'Hug' },
    { emoji: '🤪', name: 'Zany' }, { emoji: '😢', name: 'Cry' }, { emoji: '🥶', name: 'Cold' },
    { emoji: '🥰', name: 'Loving' }, { emoji: '😱', name: 'Scream' }, { emoji: '🙄', name: 'Roll Eyes' },
    { emoji: '😏', name: 'Smirk' }, { emoji: '🤯', name: 'Exploding Head' }, { emoji: '😤', name: 'Triumph' },
    { emoji: '🤭', name: 'Hand Over Mouth' }, { emoji: '😈', name: 'Devil' },
  ],
  'Gestures': [
    { emoji: '👍', name: 'Thumbs Up' }, { emoji: '👎', name: 'Thumbs Down' }, { emoji: '👏', name: 'Clap' },
    { emoji: '🙌', name: 'Raise Hands' }, { emoji: '🤝', name: 'Handshake' }, { emoji: '✌️', name: 'Victory' },
    { emoji: '🤞', name: 'Cross Fingers' }, { emoji: '🖖', name: 'Vulcan' }, { emoji: '💪', name: 'Muscle' },
    { emoji: '👋', name: 'Wave' }, { emoji: '🫶', name: 'Heart Hands' }, { emoji: '🤌', name: 'Pinched Fingers' },
    { emoji: '✋', name: 'Raised Hand' }, { emoji: '👊', name: 'Fist' }, { emoji: '🫡', name: 'Salute' },
  ],
  'Nature': [
    { emoji: '❤️', name: 'Red Heart' }, { emoji: '🔥', name: 'Fire' }, { emoji: '✨', name: 'Sparkles' },
    { emoji: '⭐', name: 'Star' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '🌸', name: 'Cherry Blossom' },
    { emoji: '🌺', name: 'Hibiscus' }, { emoji: '🌻', name: 'Sunflower' }, { emoji: '🌴', name: 'Palm Tree' },
    { emoji: '☀️', name: 'Sun' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '🌊', name: 'Wave' },
    { emoji: '🍀', name: 'Clover' }, { emoji: '🎄', name: 'Christmas' }, { emoji: '🦋', name: 'Butterfly' },
    { emoji: '🐱', name: 'Cat' }, { emoji: '🐶', name: 'Dog' }, { emoji: '🦊', name: 'Fox' },
    { emoji: '🐼', name: 'Panda' }, { emoji: '🐸', name: 'Frog' }, { emoji: '🐝', name: 'Bee' },
  ],
  'Food': [
    { emoji: '🍕', name: 'Pizza' }, { emoji: '🍔', name: 'Burger' }, { emoji: '🌮', name: 'Taco' },
    { emoji: '🍜', name: 'Ramen' }, { emoji: '🍣', name: 'Sushi' }, { emoji: '🍩', name: 'Donut' },
    { emoji: '🎂', name: 'Cake' }, { emoji: '🍦', name: 'Ice Cream' }, { emoji: '☕', name: 'Coffee' },
    { emoji: '🍺', name: 'Beer' }, { emoji: '🥤', name: 'Drink' }, { emoji: '🍇', name: 'Grapes' },
    { emoji: '🥑', name: 'Avocado' }, { emoji: '🌶️', name: 'Pepper' }, { emoji: '🧀', name: 'Cheese' },
  ],
  'Objects': [
    { emoji: '🎉', name: 'Party' }, { emoji: '🎊', name: 'Confetti' }, { emoji: '🎁', name: 'Gift' },
    { emoji: '🎶', name: 'Music' }, { emoji: '📱', name: 'Phone' }, { emoji: '💻', name: 'Laptop' },
    { emoji: '📸', name: 'Camera' }, { emoji: '🔒', name: 'Lock' }, { emoji: '🔑', name: 'Key' },
    { emoji: '💡', name: 'Bulb' }, { emoji: '📦', name: 'Package' }, { emoji: '🧠', name: 'Brain' },
    { emoji: '🎯', name: 'Target' }, { emoji: '🎨', name: 'Palette' }, { emoji: '🛠️', name: 'Tools' },
    { emoji: '⚡', name: 'Zap' }, { emoji: '🧩', name: 'Puzzle' }, { emoji: '🎮', name: 'Game' },
    { emoji: '📚', name: 'Books' }, { emoji: '✏️', name: 'Pencil' },
  ],
}

export function EmojiPicker() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return categories
    const q = search.toLowerCase()
    const result: typeof categories = {}
    for (const [cat, items] of Object.entries(categories)) {
      const filtered = items.filter(i => i.name.toLowerCase().includes(q) || i.emoji.includes(q))
      if (filtered.length) result[cat] = filtered
    }
    return result
  }, [search])

  const copy = (emoji: string, name: string) => {
    navigator.clipboard.writeText(emoji).catch(() => {})
    toast.success(`Copied ${name}`)
  }

  return (
    <div className="space-y-4">
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search emojis..." className="max-w-md" />

      {Object.entries(filtered).map(([cat, items]) => (
        <div key={cat}>
          <div className="text-sm font-medium text-muted-foreground mb-2">{cat}</div>
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <button
                key={item.emoji}
                onClick={() => copy(item.emoji, item.name)}
                className="text-2xl w-12 h-12 flex items-center justify-center rounded-lg border bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all hover:scale-110"
                title={item.name}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}