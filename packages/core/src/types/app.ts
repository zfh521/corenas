export interface AppInfo {
  id: string
  name: string
  version: string
  icon?: string
  component: string
  defaultWidth: number
  defaultHeight: number
  singleton: boolean // 是否为单例应用，默认为 false
} 