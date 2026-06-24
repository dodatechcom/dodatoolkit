import type { ComponentType } from 'react'

export interface UtilityGroup {
  id: string
  name: string
  emoji: string
  gradient: string
}

export interface UtilityDefinition {
  id: string
  name: string
  description: string
  emoji: string
  groupId: string
  component: ComponentType
}
