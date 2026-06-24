import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const gitmojis = [
  { emoji: '🎨', code: ':art:', desc: 'Improve structure / format of code' },
  { emoji: '⚡️', code: ':zap:', desc: 'Improve performance' },
  { emoji: '🔥', code: ':fire:', desc: 'Remove code or files' },
  { emoji: '🐛', code: ':bug:', desc: 'Fix a bug' },
  { emoji: '🚑', code: ':ambulance:', desc: 'Critical hotfix' },
  { emoji: '✨', code: ':sparkles:', desc: 'Introduce new features' },
  { emoji: '📝', code: ':memo:', desc: 'Add or update documentation' },
  { emoji: '🚀', code: ':rocket:', desc: 'Deploy stuff' },
  { emoji: '💄', code: ':lipstick:', desc: 'Add or update UI/style files' },
  { emoji: '🎉', code: ':tada:', desc: 'Begin a project' },
  { emoji: '✅', code: ':white_check_mark:', desc: 'Add or update tests' },
  { emoji: '🔒', code: ':lock:', desc: 'Fix security issues' },
  { emoji: '🔐', code: ':closed_lock_with_key:', desc: 'Add or update secrets' },
  { emoji: '🔖', code: ':bookmark:', desc: 'Release / version tags' },
  { emoji: '🚨', code: ':rotating_light:', desc: 'Fix compiler / linter warnings' },
  { emoji: '🚧', code: ':construction:', desc: 'Work in progress' },
  { emoji: '💚', code: ':green_heart:', desc: 'Fix CI build' },
  { emoji: '⬇️', code: ':arrow_down:', desc: 'Downgrade dependencies' },
  { emoji: '⬆️', code: ':arrow_up:', desc: 'Upgrade dependencies' },
  { emoji: '📌', code: ':pushpin:', desc: 'Pin dependencies to specific versions' },
  { emoji: '👷', code: ':construction_worker:', desc: 'Add or update CI build system' },
  { emoji: '📈', code: ':chart_with_upwards_trend:', desc: 'Add or update analytics / tracking' },
  { emoji: '♻️', code: ':recycle:', desc: 'Refactor code' },
  { emoji: '➕', code: ':heavy_plus_sign:', desc: 'Add a dependency' },
  { emoji: '➖', code: ':heavy_minus_sign:', desc: 'Remove a dependency' },
  { emoji: '🔧', code: ':wrench:', desc: 'Add or update config files' },
  { emoji: '🔨', code: ':hammer:', desc: 'Add or update build scripts' },
  { emoji: '🌐', code: ':globe_with_meridians:', desc: 'Internationalization / localization' },
  { emoji: '✏️', code: ':pencil2:', desc: 'Fix typos' },
  { emoji: '💩', code: ':poop:', desc: 'Write bad code that needs improvement' },
  { emoji: '⏪', code: ':rewind:', desc: 'Revert changes' },
  { emoji: '🔀', code: ':twisted_rightwards_arrows:', desc: 'Merge branches' },
  { emoji: '📦', code: ':package:', desc: 'Add or update compiled files / packages' },
  { emoji: '👽', code: ':alien:', desc: 'Update code due to external API changes' },
  { emoji: '🚚', code: ':truck:', desc: 'Move or rename files' },
  { emoji: '📄', code: ':page_facing_up:', desc: 'Add or update license' },
  { emoji: '💥', code: ':boom:', desc: 'Introduce breaking changes' },
  { emoji: '🍱', code: ':bento:', desc: 'Add or update assets' },
  { emoji: '♿️', code: ':wheelchair:', desc: 'Improve accessibility' },
  { emoji: '💡', code: ':bulb:', desc: 'Add or update comments in source code' },
  { emoji: '🍻', code: ':beers:', desc: 'Write code drunkenly' },
  { emoji: '💬', code: ':speech_balloon:', desc: 'Add or update text / literals' },
  { emoji: '🗃️', code: ':card_file_box:', desc: 'Perform database-related changes' },
  { emoji: '🔊', code: ':loud_sound:', desc: 'Add or update logs' },
  { emoji: '🔇', code: ':mute:', desc: 'Remove logs' },
  { emoji: '👥', code: ':busts_in_silhouette:', desc: 'Add or update contributors' },
  { emoji: '🚸', code: ':children_crossing:', desc: 'Improve UX / usability' },
  { emoji: '🏗️', code: ':building_construction:', desc: 'Make architectural changes' },
  { emoji: '📱', code: ':iphone:', desc: 'Work on responsive design' },
  { emoji: '🤡', code: ':clown_face:', desc: 'Mock things' },
  { emoji: '🥚', code: ':egg:', desc: 'Add or update easter egg' },
  { emoji: '🙈', code: ':see_no_evil:', desc: 'Add or update .gitignore' },
  { emoji: '📸', code: ':camera_flash:', desc: 'Add or update snapshots' },
  { emoji: '⚗️', code: ':alembic:', desc: 'Experiment new things' },
  { emoji: '🔍', code: ':mag:', desc: 'Improve SEO' },
  { emoji: '🏷️', code: ':label:', desc: 'Add or update types' },
  { emoji: '🌱', code: ':seedling:', desc: 'Add or update seed files' },
  { emoji: '🚩', code: ':triangular_flag_on_post:', desc: 'Add or update feature flags' },
  { emoji: '🥅', code: ':goal_net:', desc: 'Catch errors' },
  { emoji: '💫', code: ':dizzy:', desc: 'Add or update animations / transitions' },
  { emoji: '🗑️', code: ':wastebasket:', desc: 'Deprecate code that needs cleanup' },
  { emoji: '🛂', code: ':passport_control:', desc: 'Work on authorization / roles / permissions' },
  { emoji: '🩹', code: ':adhesive_bandage:', desc: 'Simple fix for a non-critical issue' },
  { emoji: '🧐', code: ':monocle_face:', desc: 'Data exploration / inspection' },
  { emoji: '⚰️', code: ':coffin:', desc: 'Remove dead code' },
  { emoji: '🧪', code: ':test_tube:', desc: 'Experiment / test something' },
  { emoji: '👔', code: ':necktie:', desc: 'Add or update business logic' },
  { emoji: '🩺', code: ':stethoscope:', desc: 'Add or update healthcheck' },
  { emoji: '🧱', code: ':bricks:', desc: 'Infrastructure-related changes' },
  { emoji: '🧑‍💻', code: ':technologist:', desc: 'Improve developer experience' },
  { emoji: '💸', code: ':money_with_wings:', desc: 'Add or update sponsorships / funding' },
]

export function Gitmoji() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return gitmojis
    const q = search.toLowerCase()
    return gitmojis.filter(g => g.emoji.includes(q) || g.code.includes(q) || g.desc.toLowerCase().includes(q))
  }, [search])

  const copy = (text: string) => { navigator.clipboard.writeText(text).catch(() => {}); toast.success('Copied') }

  return (
    <div className="space-y-4">
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search gitmojis..." className="max-w-md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map(g => (
          <Card key={g.code} className="bg-white/40 dark:bg-white/5 cursor-pointer hover:shadow-sm transition-shadow" onClick={() => copy(`${g.emoji} ${g.code}`)}>
            <CardContent className="p-3 flex items-center gap-3">
              <span className="text-2xl">{g.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-mono text-muted-foreground">{g.code}</div>
                <div className="text-sm">{g.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} gitmojis</p>
    </div>
  )
}
