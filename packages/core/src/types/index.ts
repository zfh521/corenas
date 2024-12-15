// 导出Vue相关类型
export * from './vue.d'

// 基础事件接口
export interface Event {
  type: string
  payload?: any
}

// 事件处理器接口
export type EventHandler = (event: Event) => void

// 事件发布者接口
export interface EventEmitter {
  emit(event: Event): void
  on(type: string, handler: EventHandler): void
  off(type: string, handler: EventHandler): void
}

// 窗口状态接口
export interface WindowState {
  id: string
  title: string
  icon?: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
}

// 主题类型
export type ThemeType = 'win11' | 'macos'

// 系统设置接口
export interface SystemSettings {
  theme: ThemeType
  darkMode: boolean
  transparency: boolean
  accentColor: string
}

// 应用信息接口
export interface AppInfo {
  id: string
  name: string
  version: string
  icon?: string
  component: string
  defaultWidth: number
  defaultHeight: number
  singleton: boolean
} 