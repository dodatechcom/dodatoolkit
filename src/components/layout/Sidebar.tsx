import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { utilityGroups, getUtilitiesByGroup, getUtilityById, getGroupById } from '@/registry/utilities'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { UtilityDefinition } from '@/types/utility'

interface SidebarProps {
  activeUtilityId: string | null
  onSelectUtility: (id: string) => void
}

export function Sidebar({ activeUtilityId, onSelectUtility }: SidebarProps) {
  const [collapsedGroups, setCollapsedGroups] = useLocalStorage<string[]>('doda-collapsed-groups', [])
  const [favorites, setFavorites] = useLocalStorage<string[]>('doda-favorites', [])
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (!activeUtilityId) return
    const util = getUtilityById(activeUtilityId)
    if (!util) return
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      next.delete(util.groupId)
      utilityGroups.forEach(g => { if (g.id !== util.groupId) next.add(g.id) })
      return Array.from(next)
    })
  }, [activeUtilityId])

  function toggleGroup(groupId: string) {
    setCollapsedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId],
    )
  }

  function toggleFavorite(e: React.MouseEvent, utilityId: string) {
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(utilityId) ? prev.filter((id) => id !== utilityId) : [...prev, utilityId],
    )
  }

  const favUtilities = favorites.map(id => getUtilityById(id)).filter(Boolean) as UtilityDefinition[]

  return (
    <aside aria-label="Utility navigation" className="w-64 h-full flex flex-col bg-card/50 border-r border-border overflow-hidden">
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {favUtilities.length > 0 && (
          <div className="mb-2 pb-2 border-b border-border">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">⭐ Favorites</p>
            <div className="space-y-0.5">
              {favUtilities.map(u => {
                const g = getGroupById(u.groupId)
                return (
                  <button key={u.id} onClick={() => onSelectUtility(u.id)}
                    className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                  >
                    <span className="text-base">{u.emoji}</span>
                    <span className="flex-1 text-left truncate">{u.name}</span>
                    <span className="text-[10px] text-muted-foreground">{g?.emoji}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {utilityGroups.map((group) => {
          const groupUtilities = getUtilitiesByGroup(group.id)
          const isCollapsed = collapsedGroups.includes(group.id)
          return (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                aria-expanded={!isCollapsed}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <span className="text-sm">{group.emoji}</span>
                <span className="flex-1 text-left">{group.name}</span>
                <span className="text-[10px] font-normal opacity-60">{groupUtilities.length}</span>
                <motion.span
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 pl-2 py-1">
                      {groupUtilities.map((utility) => {
                        const isActive = utility.id === activeUtilityId
                        const isFavorite = favorites.includes(utility.id)
                        return (
                          <button
                            key={utility.id}
                            onClick={() => onSelectUtility(utility.id)}
                            title={`${utility.name} (${utility.emoji})`}
                            className={cn(
                              'relative flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 group',
                              isActive
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="active-utility"
                                className={cn(
                                  'absolute inset-0 rounded-xl bg-gradient-to-br opacity-10',
                                  group.gradient,
                                )}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                            <span className="relative text-base">{utility.emoji}</span>
                            <span className="relative flex-1 text-left truncate">{utility.name}</span>
                            <button
                              onClick={(e) => toggleFavorite(e, utility.id)}
                              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              className={cn(
                                'relative opacity-0 group-hover:opacity-100 transition-opacity text-xs',
                                isFavorite && 'opacity-100',
                              )}
                            >
                              {isFavorite ? '⭐' : '☆'}
                            </button>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border">
        <div className="flex border-b border-border">
          <a href="https://docs.dodatech.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            🆘 Help
          </a>
          <a href="https://dodatech.com/donate/" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-l border-border">
            💝 Donate
          </a>
          <button onClick={() => setAboutOpen(o => !o)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-l border-border">
            ℹ️ About
          </button>
        </div>
        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-1.5 text-[10px] text-muted-foreground bg-card/30">
                <p className="font-semibold text-foreground">🧰 Doda Toolkit v1.0</p>
                <p>75 utilities across 7 groups.</p>
                <p>Built with ❤️ by <a href="https://dodatech.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DodaTech.com</a></p>
                <p className="pt-1">All data is processed locally in your browser. Nothing is sent to any server.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
