import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import toast from 'react-hot-toast'

type ThemePref = 'light' | 'dark' | 'system'

function applyTheme(pref: ThemePref) {
  const isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function Settings() {
  const [defaultTheme, setDefaultTheme] = useLocalStorage<ThemePref>('doda-theme', 'system')
  const [clipboardAuto, setClipboardAuto] = useLocalStorage('doda-settings-clipboard', true)
  const [showShortcuts, setShowShortcuts] = useLocalStorage('doda-settings-shortcuts', true)

  const changeTheme = (val: ThemePref) => {
    setDefaultTheme(val)
    applyTheme(val)
    toast.success('Theme updated')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">Appearance</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label>Default Theme</Label>
              <p className="text-xs text-muted-foreground">Applied on first visit and across tabs</p>
            </div>
            <select
              value={defaultTheme}
              onChange={e => changeTheme(e.target.value as ThemePref)}
              className="px-3 py-1.5 rounded-lg border bg-background text-sm"
            >
              <option value="system">💻 System</option>
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">Clipboard</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-track clipboard</Label>
              <p className="text-xs text-muted-foreground">Automatically capture copied items</p>
            </div>
            <button
              onClick={() => { setClipboardAuto(!clipboardAuto); toast.success(clipboardAuto ? 'Auto-track disabled' : 'Auto-track enabled') }}
              className={`relative w-11 h-6 rounded-full transition-colors ${clipboardAuto ? 'bg-primary' : 'bg-muted'}`}
              role="switch"
              aria-checked={clipboardAuto}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${clipboardAuto ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">Interface</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label>Toolbar hints</Label>
              <p className="text-xs text-muted-foreground">Show tooltips on sidebar items</p>
            </div>
            <button
              onClick={() => { setShowShortcuts(!showShortcuts); toast.success(showShortcuts ? 'Hints hidden' : 'Hints shown') }}
              className={`relative w-11 h-6 rounded-full transition-colors ${showShortcuts ? 'bg-primary' : 'bg-muted'}`}
              role="switch"
              aria-checked={showShortcuts}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${showShortcuts ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-2">
          <h3 className="font-semibold text-sm">About</h3>
          <p className="text-xs text-muted-foreground">Doda Toolkit v1.0 — 80 utilities across 8 groups</p>
          <p className="text-xs text-muted-foreground">All data is stored locally in your browser. Nothing is sent to any server.</p>
        </CardContent>
      </Card>
    </div>
  )
}
