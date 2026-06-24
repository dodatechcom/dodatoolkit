import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { getUtilityById, getGroupById } from '@/registry/utilities'
import { cn } from '@/lib/utils'

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

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <span className="text-7xl animate-bounce">🧰</span>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Welcome to Doda Toolkit
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        Choose a utility from the sidebar or press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">⌘K</kbd> to search.
      </p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {['📱 QR Code', '📋 JSON', '🔢 UUID', '🔐 Base64', '🔑 Hash', '↔️ Case', '📐 Units', '🎨 Color'].map((item) => (
          <div key={item} className="glass rounded-2xl px-4 py-3 text-sm text-center text-muted-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Shell({ activeUtilityId, onSelectUtility }: ShellProps) {
  const { theme, toggleTheme } = useTheme()
  const utility = activeUtilityId ? getUtilityById(activeUtilityId) : null
  const group = utility ? getGroupById(utility.groupId) : null
  const UtilityComponent = utility?.component

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
                <WelcomeScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
