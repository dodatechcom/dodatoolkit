import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSearch } from '@/hooks/useSearch'
import { getGroupById } from '@/registry/utilities'
import type { UtilityDefinition } from '@/types/utility'

interface HeaderProps {
  activeUtilityId: string | null
  onSelectUtility: (id: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function Header({ activeUtilityId, onSelectUtility, theme, toggleTheme }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const searchResults = useSearch(searchQuery)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setActiveIndex(0)
  }, [searchQuery])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
      if (searchOpen && e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % searchResults.length)
      }
      if (searchOpen && e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
      }
      if (searchOpen && e.key === 'Enter' && searchResults.length > 0) {
        e.preventDefault()
        handleSelect(searchResults[activeIndex])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, searchResults, activeIndex])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  function handleSelect(utility: UtilityDefinition) {
    onSelectUtility(utility.id)
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header
      className="relative z-50 flex items-center justify-between px-4 h-12 bg-background/80 backdrop-blur-xl border-b border-border"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <span className="text-xl">🧰</span>
        <span className="font-semibold text-sm bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Doda Toolkit
        </span>
      </div>

      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          <span className="text-xs">🔍</span>
          <span className="hidden sm:inline">Search utilities...</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">⌘K</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-lg"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {window.electronAPI && (
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-green-500"
              title="Desktop mode"
            />
            <button
              onClick={() => window.electronAPI!.minimize()}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-xs"
              aria-label="Minimize"
            >
              ⏤
            </button>
            <button
              onClick={() => window.electronAPI!.maximize()}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-xs"
              aria-label="Maximize"
            >
              □
            </button>
            <button
              onClick={() => window.electronAPI!.close()}
              className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-xs text-destructive"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 mx-4 z-50"
          >
            <div
              ref={searchRef}
              className="glass-strong rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className="text-sm">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search utilities..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted font-mono">ESC</span>
              </div>
              <div className="max-h-60 overflow-y-auto p-2" role="listbox">
                {searchResults.length === 0 && searchQuery.trim() ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No utilities found</p>
                ) : (
                  searchResults.map((utility, i) => (
                    <button
                      key={utility.id}
                      role="option"
                      aria-selected={i === activeIndex}
                      ref={i === activeIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                      onClick={() => handleSelect(utility)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors',
                        i === activeIndex
                          ? 'bg-accent text-foreground'
                          : 'hover:bg-accent/50',
                        utility.id === activeUtilityId && 'bg-primary/10 text-primary',
                      )}
                    >
                      <span className="text-lg">{utility.emoji}</span>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{utility.name}</p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{getGroupById(utility.groupId)?.emoji}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{utility.description}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
