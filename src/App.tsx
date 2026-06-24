import { Shell } from '@/components/layout/Shell'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function App() {
  const [activeUtilityId, setActiveUtilityId] = useLocalStorage<string | null>('doda-active-utility', null)

  return <Shell activeUtilityId={activeUtilityId} onSelectUtility={setActiveUtilityId} />
}
