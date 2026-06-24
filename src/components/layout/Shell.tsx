import { Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { getUtilityById, getGroupById, utilities } from '@/registry/utilities'
import { cn } from '@/lib/utils'
import type { UtilityDefinition } from '@/types/utility'

interface ShellProps {
  activeUtilityId: string | null
  onSelectUtility: (id: string) => void
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

function getRecents(): UtilityDefinition[] {
  try {
    const ids = JSON.parse(localStorage.getItem('doda-recents') || '[]') as string[]
    return ids.map(id => getUtilityById(id)).filter(Boolean) as UtilityDefinition[]
  } catch { return [] }
}

function addRecent(id: string) {
  try {
    const ids = JSON.parse(localStorage.getItem('doda-recents') || '[]') as string[]
    const next = [id, ...ids.filter(i => i !== id)].slice(0, 6)
    localStorage.setItem('doda-recents', JSON.stringify(next))
  } catch {}
}

const quickAccessIds = ['qr-code', 'json-formatter', 'uuid-generator', 'base64-encoder', 'hash-generator', 'case-converter', 'unit-converter', 'image-converter', 'clipboard-manager', 'currency-converter', 'playground', 'text-cleaner']

function WelcomeScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const recents = getRecents()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 py-8">
      <span className="text-6xl animate-bounce">🧰</span>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Welcome to Doda Toolkit
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        Choose a utility from the sidebar or press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">⌘K</kbd> to search.
      </p>

      {recents.length > 0 && (
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recently Used</p>
          <div className="flex flex-wrap gap-2">
            {recents.map(u => (
              <button key={u.id} onClick={() => onSelect(u.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-white/40 dark:bg-white/5 border hover:bg-accent transition-colors">
                <span>{u.emoji}</span>
                <span>{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Access</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {quickAccessIds.map(id => {
            const u = getUtilityById(id)
            if (!u) return null
            return (
              <button key={u.id} onClick={() => onSelect(u.id)}
                className="glass rounded-2xl px-3 py-3 text-sm text-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all">
                <div className="text-xl mb-1">{u.emoji}</div>
                <div className="text-[11px] leading-tight">{u.name}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Shell({ activeUtilityId, onSelectUtility }: ShellProps) {
  const { theme, toggleTheme } = useTheme()
  const utility = activeUtilityId ? getUtilityById(activeUtilityId) : null
  const group = utility ? getGroupById(utility.groupId) : null
  const UtilityComponent = utility?.component

  useEffect(() => {
    if (activeUtilityId) addRecent(activeUtilityId)
  }, [activeUtilityId])

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header activeUtilityId={activeUtilityId} onSelectUtility={onSelectUtility} theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeUtilityId={activeUtilityId} onSelectUtility={onSelectUtility} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/30">
          <AnimatePresence mode="wait">
            {UtilityComponent && utility ? (
              <motion.div
                key={utility.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{utility.emoji}</span>
                    <div>
                      <h1 className="text-xl font-bold">{utility.name}</h1>
                      <p className="text-sm text-muted-foreground">{utility.description}</p>
                    </div>
                    {group && (
                      <span
                        className={cn(
                          'ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br text-white shadow-lg',
                          group.gradient,
                        )}
                      >
                        {group.emoji} {group.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Suspense fallback={<LoadingFallback />}>
                    <UtilityComponent />
                  </Suspense>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <WelcomeScreen onSelect={onSelectUtility} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
