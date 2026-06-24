import { useState, useEffect, useCallback } from 'react'

type ThemePref = 'light' | 'dark' | 'system'

function getStoredPref(): ThemePref {
  const stored = localStorage.getItem('doda-theme')
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  return 'system'
}

function resolveTheme(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return pref
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(getStoredPref)
  const [effective, setEffective] = useState<'light' | 'dark'>(() => resolveTheme(getStoredPref()))

  const sync = useCallback(() => {
    const p = getStoredPref()
    setPref(p)
    setEffective(resolveTheme(p))
  }, [])

  useEffect(() => { sync() }, [sync])

  useEffect(() => {
    setEffective(resolveTheme(pref))
  }, [pref])

  useEffect(() => {
    const handler = () => sync()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [sync])

  useEffect(() => {
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setEffective(resolveTheme('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [pref])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', effective === 'dark')
  }, [effective])

  const setThemePref = useCallback((p: ThemePref) => {
    localStorage.setItem('doda-theme', p)
    setPref(p)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = effective === 'light' ? 'dark' : 'light'
    localStorage.setItem('doda-theme', next)
    setPref(next)
  }, [effective])

  return { theme: effective, pref, setThemePref, toggleTheme }
}
