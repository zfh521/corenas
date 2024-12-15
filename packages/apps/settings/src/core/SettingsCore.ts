import { ThemeType } from '@corenas/core'

export interface SettingsState {
  theme: ThemeType
  darkMode: boolean
  transparency: boolean
  accentColor: string
  language: string
  fontSize: number
  soundEnabled: boolean
  notificationsEnabled: boolean
}

export class SettingsCore {
  private state: SettingsState = {
    theme: 'win11',
    darkMode: false,
    transparency: true,
    accentColor: '#0078D4',
    language: 'zh-CN',
    fontSize: 14,
    soundEnabled: true,
    notificationsEnabled: true
  }

  constructor(initialState?: Partial<SettingsState>) {
    if (initialState) {
      this.state = { ...this.state, ...initialState }
    }
  }

  getState(): SettingsState {
    return { ...this.state }
  }

  setState(state: Partial<SettingsState>): void {
    this.state = { ...this.state, ...state }
  }

  // 主题相关设置
  setTheme(theme: ThemeType): void {
    this.setState({ theme })
  }

  toggleDarkMode(): void {
    this.setState({ darkMode: !this.state.darkMode })
  }

  toggleTransparency(): void {
    this.setState({ transparency: !this.state.transparency })
  }

  setAccentColor(color: string): void {
    this.setState({ accentColor: color })
  }

  // 语言设置
  setLanguage(language: string): void {
    this.setState({ language })
  }

  // 字体大小设置
  setFontSize(size: number): void {
    this.setState({ fontSize: size })
  }

  // 声音设置
  toggleSound(): void {
    this.setState({ soundEnabled: !this.state.soundEnabled })
  }

  // 通知设置
  toggleNotifications(): void {
    this.setState({ notificationsEnabled: !this.state.notificationsEnabled })
  }

  // 导出设置
  exportSettings(): string {
    return JSON.stringify(this.state)
  }

  // 导入设置
  importSettings(settings: string): void {
    try {
      const parsed = JSON.parse(settings)
      this.setState(parsed)
    } catch (e) {
      console.error('Failed to import settings:', e)
    }
  }

  // 重置设置
  resetSettings(): void {
    this.state = {
      theme: 'win11',
      darkMode: false,
      transparency: true,
      accentColor: '#0078D4',
      language: 'zh-CN',
      fontSize: 14,
      soundEnabled: true,
      notificationsEnabled: true
    }
  }
} 