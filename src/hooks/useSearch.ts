import { useState, useMemo } from 'react'
import { utilities } from '@/registry/utilities'

export function useSearch(query: string) {
  return useMemo(() => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    return utilities.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.description.toLowerCase().includes(lower) ||
        u.emoji.includes(query),
    )
  }, [query])
}
