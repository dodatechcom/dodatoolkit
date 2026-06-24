import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rose', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.org', 'test.io', 'mail.com', 'proton.me']
const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Toronto', 'Mumbai', 'Seoul', 'Dubai', 'Singapore', 'San Francisco']
const streets = ['Main St', 'Oak Ave', 'Elm Rd', 'Pine Ln', 'Maple Dr', 'Cedar Ct', 'Birch Way', 'Walnut Blvd']
const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']
const jobs = ['Software Engineer', 'Doctor', 'Teacher', 'Designer', 'Writer', 'Chef', 'Architect', 'Scientist', 'Lawyer', 'Artist', 'Engineer', 'Manager']
const companies = ['TechCorp', 'DataFlow', 'InnovateCo', 'GlobalSys', 'NextGen', 'AlphaTech', 'BrightPath', 'CloudNine', 'StarLight', 'CyberSoft']
const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function phone(): string {
  return `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`
}
function email(first: string, last: string): string {
  return `${first.toLowerCase()}.${last.toLowerCase()}@${rand(domains)}`
}
function address(): string {
  return `${randInt(1, 9999)} ${rand(streets)}, ${rand(cities)}, ${rand(states)} ${randInt(10000, 99999)}`
}
function sentence(): string {
  const words = lorem.split(' ')
  const len = randInt(5, 15)
  const start = randInt(0, words.length - len - 1)
  return words.slice(start, start + len).join(' ') + '.'
}

type GeneratorType = {
  id: string
  label: string
  emoji: string
  generate: () => string
}

const generators: GeneratorType[] = [
  { id: 'name', label: 'Full Name', emoji: '👤', generate: () => `${rand(firstNames)} ${rand(lastNames)}` },
  { id: 'email', label: 'Email', emoji: '📧', generate: () => {
    const f = rand(firstNames); const l = rand(lastNames)
    return email(f, l)
  }},
  { id: 'phone', label: 'Phone', emoji: '📞', generate: phone },
  { id: 'address', label: 'Address', emoji: '🏠', generate: address },
  { id: 'job', label: 'Job Title', emoji: '💼', generate: () => `${rand(jobs)} at ${rand(companies)}` },
  { id: 'company', label: 'Company', emoji: '🏢', generate: () => rand(companies) },
  { id: 'city', label: 'City', emoji: '🌆', generate: () => rand(cities) },
  { id: 'sentence', label: 'Sentence', emoji: '📝', generate: sentence },
]

function generateAll(): string[] {
  return generators.map(g => g.generate())
}

export function FakeData() {
  const [count, setCount] = useState(5)
  const [rows, setRows] = useState<string[][]>(() =>
    Array.from({ length: 5 }, () => generateAll())
  )

  const generate = () => {
    setRows(Array.from({ length: count }, () => generateAll()))
  }

  const copyRow = (row: string[]) => {
    navigator.clipboard.writeText(row.join(' | ')).catch(() => {})
    toast.success('Copied row')
  }

  const copyAll = () => {
    const csv = [generators.map(g => g.label), ...rows.map(r => r)]
      .map(r => r.map(c => `"${c}"`).join(','))
      .join('\n')
    navigator.clipboard.writeText(csv).catch(() => {})
    toast.success('Copied all as CSV')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={generate} size="sm">
          🎲 Generate
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows:</span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-1 rounded-md border bg-white/50 dark:bg-white/5 text-sm"
          />
        </div>
        <Button onClick={copyAll} variant="outline" size="sm">
          📋 Copy All as CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/60 dark:bg-white/10">
              {generators.map(g => (
                <th key={g.id} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                  {g.emoji} {g.label}
                </th>
              ))}
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-white/20 hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 whitespace-nowrap">{cell}</td>
                ))}
                <td className="px-3 py-2">
                  <button onClick={() => copyRow(row)} className="text-xs text-muted-foreground hover:text-foreground">
                    📋
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}