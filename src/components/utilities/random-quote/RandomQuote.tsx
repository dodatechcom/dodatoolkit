import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const quotes = [
  // Tech & Programming
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it’s bad.', author: 'Cory House' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'The best code is no code at all.', author: 'Jeff Atwood' },
  { text: 'Debugging is twice as hard as writing the code in the first place.', author: 'Brian Kernighan' },
  { text: 'A language that doesn’t affect the way you think about programming is not worth knowing.', author: 'Alan Perlis' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  // Science & Innovation
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Imagination is more important than knowledge.', author: 'Albert Einstein' },
  { text: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
  { text: 'The important thing is not to stop questioning.', author: 'Albert Einstein' },
  { text: 'Nothing in life is to be feared, it is only to be understood.', author: 'Marie Curie' },
  { text: 'Science knows no country, because knowledge belongs to humanity.', author: 'Louis Pasteur' },
  { text: 'The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.', author: 'Isaac Asimov' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'The universe is under no obligation to make sense to you.', author: 'Neil deGrasse Tyson' },
  { text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan' },
  // Literature & Philosophy
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
  { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama' },
  { text: 'In three words I can sum up everything I’ve learned about life: it goes on.', author: 'Robert Frost' },
  { text: 'To be or not to be, that is the question.', author: 'William Shakespeare' },
  { text: 'All that we see or seem is but a dream within a dream.', author: 'Edgar Allan Poe' },
  { text: 'It is never too late to be what you might have been.', author: 'George Eliot' },
  { text: 'Two roads diverged in a wood, and I — I took the one less traveled by.', author: 'Robert Frost' },
  { text: 'We are what we pretend to be, so we must be careful about what we pretend to be.', author: 'Kurt Vonnegut' },
  { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
  { text: 'The only wisdom we can hope to acquire is the wisdom of humility.', author: 'T.S. Eliot' },
  // Leadership & Perseverance
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Believe you can and you’re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { text: 'Whether you think you can or you think you can’t, you’re right.', author: 'Henry Ford' },
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'Get busy living or get busy dying.', author: 'Stephen King' },
  { text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Everything you’ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  // Creativity & Art
  { text: 'Every artist was first an amateur.', author: 'Ralph Waldo Emerson' },
  { text: 'Creativity is intelligence having fun.', author: 'Albert Einstein' },
  { text: 'Art is the lie that enables us to realize the truth.', author: 'Pablo Picasso' },
  { text: 'The chief enemy of creativity is good sense.', author: 'Pablo Picasso' },
  { text: 'Every child is an artist. The problem is how to remain an artist once we grow up.', author: 'Pablo Picasso' },
  { text: 'The purpose of art is washing the dust of daily life off our souls.', author: 'Pablo Picasso' },
  { text: 'Creativity takes courage.', author: 'Henri Matisse' },
  { text: 'Imagination is the beginning of creation.', author: 'George Bernard Shaw' },
  { text: 'You can’t use up creativity. The more you use, the more you have.', author: 'Maya Angelou' },
  { text: 'Don’t think. Thinking is the enemy of creativity.', author: 'Ray Bradbury' },
  // Humor & Wit
  { text: 'I have nothing to declare except my genius.', author: 'Oscar Wilde' },
  { text: 'I can resist everything except temptation.', author: 'Oscar Wilde' },
  { text: 'I am so clever that sometimes I don’t understand a single word of what I am saying.', author: 'Oscar Wilde' },
  { text: 'The trouble with having an open mind is that people will insist on coming along and putting things in it.', author: 'Terry Pratchett' },
  { text: 'The difference between stupidity and genius is that genius has its limits.', author: 'Albert Einstein' },
  { text: 'Always forgive your enemies; nothing annoys them so much.', author: 'Oscar Wilde' },
  { text: 'I’m writing a book. I’ve got the page numbers done.', author: 'Steven Wright' },
  { text: 'If at first you don’t succeed, then skydiving is not for you.', author: 'Steven Wright' },
  { text: 'Light travels faster than sound. This is why some people appear bright until you hear them speak.', author: 'Alan Dundes' },
  { text: 'A computer once beat me at chess, but it was no match for me at kick boxing.', author: 'Emo Philips' },
  // Stoicism & Wisdom
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca' },
  { text: 'It’s not what happens to you, but how you react to it that matters.', author: 'Epictetus' },
  { text: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius' },
  { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'He who is brave is free.', author: 'Seneca' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { text: 'Life is not a problem to be solved, but a reality to be experienced.', author: 'Soren Kierkegaard' },
  { text: 'Man is condemned to be free.', author: 'Jean-Paul Sartre' },
  { text: 'We are our choices.', author: 'Jean-Paul Sartre' },
  // Modern & Misc
  { text: 'Nothing is impossible, the word itself says I’m possible!', author: 'Audrey Hepburn' },
  { text: 'You must be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'An eye for an eye only ends up making the whole world blind.', author: 'Mahatma Gandhi' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt' },
  { text: 'Great minds discuss ideas; average minds discuss events; small minds discuss people.', author: 'Eleanor Roosevelt' },
  { text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
  { text: 'I have learned over the years that when one’s mind is made up, this diminishes fear.', author: 'Rosa Parks' },
  { text: 'The most difficult thing is the decision to act, the rest is merely tenacity.', author: 'Amelia Earhart' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'If you can dream it, you can do it.', author: 'Walt Disney' },
  { text: 'It’s kind of fun to do the impossible.', author: 'Walt Disney' },
  { text: 'The past cannot be changed. The future is yet in your power.', author: 'Mary Pickford' },
  { text: 'Do not wait for leaders; do it alone, person to person.', author: 'Mother Teresa' },
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
