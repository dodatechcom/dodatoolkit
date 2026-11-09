# Contributing to Doda Toolkit

Thank you for contributing to Doda Toolkit! This guide covers our architecture, standards, and how to add new utilities.

---

## 🔒 Core Principles

1. **100% Client-Side & Offline-First**:
   - Utilities must execute locally in the client/renderer process.
   - Do not make external server requests for processing or telemetry.
   - Local storage (`localStorage`) is strictly reserved for user preferences (theme, recents, favorites, persistent notes).
2. **Modular & Lazy-Loaded**:
   - Each utility is an isolated bundle chunk loaded on demand via `React.lazy`.
   - Adding or updating one utility must never cause regressions in others.
3. **Zero Bloat & Professional Utility**:
   - Focus on practical developer, designer, data, security, and everyday utility tools.
   - Avoid pseudo-science, games, or novelty widgets that detract from product quality.

---

## 🛠️ How to Add a New Utility

Adding a new utility takes only **3 simple steps**:

### Step 1: Create the Component Folder
Create a new folder in `src/components/utilities/<your-utility-name>/`:

```
src/components/utilities/my-utility/
├── MyUtility.tsx      # Main React component
├── MyUtility.test.tsx # (Recommended) Vitest unit tests
└── index.ts           # Clean default or named export
```

#### Example `MyUtility.tsx`:
```tsx
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export function MyUtility() {
  const [val, setVal] = useState('')

  function handleAction() {
    toast.success('Action performed!')
  }

  return (
    <div className="max-w-xl space-y-4 mx-auto">
      <Card className="glass border-none shadow-xl">
        <CardContent className="p-6 space-y-4">
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter input..."
          />
          <Button onClick={handleAction} variant="glass">
            Execute
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Example `index.ts`:
```ts
export { MyUtility as default } from './MyUtility'
```

### Step 2: Register in `src/registry/utilities.ts`
Open `src/registry/utilities.ts` and add your utility entry:

```ts
{
  id: 'my-utility',
  name: 'My Utility Name',
  description: 'Clear, concise description of what the utility does',
  emoji: '🛠️',
  groupId: 'code-data', // 'code-data' | 'text' | 'converters' | 'security' | 'network' | 'design' | 'everyday' | 'system'
  component: lazy(() => import('@/components/utilities/my-utility')),
},
```

### Step 3: Write a Unit Test
Create `MyUtility.test.tsx` in your component directory:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { MyUtility } from './MyUtility'

describe('MyUtility', () => {
  it('renders input field', () => {
    render(<MyUtility />)
    expect(screen.getByPlaceholderText('Enter input...')).toBeInTheDocument()
  })
})
```

Run your tests:
```bash
npm test
```

---

## 🎨 UI & Styling Conventions

- **Glassmorphism**: Use `glass border-none shadow-xl` for primary cards.
- **Backgrounds**: Use `bg-white/40 dark:bg-white/5` for inner nested items and tables.
- **Copy Buttons**: Always provide clipboard copy actions with feedback (`toast.success('Copied!')`).
- **Responsive Layout**: Wrap your component content in `max-w-xl mx-auto` or `max-w-2xl mx-auto`.
- **Keyboard Shortcuts**: Respect `⌘K` / `Ctrl+K` for global utility searching.

---

## 🧪 Verification Before Committing

Always verify your changes before submitting:

```bash
# 1. Run all unit tests
npm test

# 2. Verify compilation & bundling
npm run build

# 3. Test Electron launcher
npm run electron:dev
```
