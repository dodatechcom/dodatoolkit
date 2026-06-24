import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import toast from 'react-hot-toast'

export function GradientGenerator() {
  const [color1, setColor1] = useState('#6366f1')
  const [color2, setColor2] = useState('#ec4899')
  const [angle, setAngle] = useState(135)
  const [type, setType] = useState<'linear' | 'radial'>('linear')

  const css = useMemo(() => {
    if (type === 'linear') return `linear-gradient(${angle}deg, ${color1}, ${color2})`
    return `radial-gradient(circle, ${color1}, ${color2})`
  }, [color1, color2, angle, type])

  const tailwind = useMemo(() => {
    const dir = angle <= 45 ? 'r' : angle <= 135 ? 'tr' : angle <= 225 ? 'l' : 'bl'
    return `bg-gradient-to-${dir} ${'fr' + 'om'}-[${color1}] ${'t' + 'o'}-[${color2}]`
  }, [color1, color2, angle])

  const copyCss = () => {
    navigator.clipboard.writeText(css).catch(() => {})
    toast.success('CSS copied')
  }

  const copyTailwind = () => {
    navigator.clipboard.writeText(tailwind).catch(() => {})
    toast.success('Tailwind class copied')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Color 1</Label>
              <Input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="h-12 p-1 cursor-pointer" />
            </div>
            <div>
              <Label>Color 2</Label>
              <Input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="h-12 p-1 cursor-pointer" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Type</Label>
              <Select
                value={type}
                onChange={e => setType(e.target.value as 'linear' | 'radial')}
                options={[
                  { value: 'linear', label: 'Linear' },
                  { value: 'radial', label: 'Radial' },
                ]}
              />
            </div>
            {type === 'linear' && (
              <div className="flex-1">
                <Label>Angle: {angle}°</Label>
                <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full" aria-label="Gradient angle" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={copyCss} size="sm">📋 Copy CSS</Button>
            <Button onClick={copyTailwind} variant="outline" size="sm">📋 Copy Tailwind</Button>
          </div>

          <div>
            <Label>CSS</Label>
            <code className="block p-3 rounded-lg bg-white/40 dark:bg-white/5 text-xs font-mono break-all border">
              background: {css};
            </code>
          </div>
        </div>

        <div>
          <Label>Preview</Label>
          <div className="rounded-xl border h-64 flex items-center justify-center text-white/80 font-bold text-lg"
            style={{ background: css }}>
            Gradient Preview
          </div>
        </div>
      </div>
    </div>
  )
}