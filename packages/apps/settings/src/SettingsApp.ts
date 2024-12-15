import { BaseApp } from '@corenas/app-framework'
import { useThemeManager } from '@corenas/services'
import { SettingsCore, SettingsState } from './core/SettingsCore'

export class SettingsApp extends BaseApp {
  private core: SettingsCore
  private themeManager = useThemeManager()

  constructor(context: any) {
    super(context)
    this.core = new SettingsCore()
  }

  async init(): Promise<void> {
    // 从主题管理器同步初始状态
    this.core.setState({
      theme: this.themeManager.theme,
      darkMode: this.themeManager.darkMode,
      transparency: this.themeManager.transparency,
      accentColor: this.themeManager.accentColor
    })

    // 恢复其他保存的设置
    const savedState = this.getState<SettingsState>('state')
    if (savedState) {
      this.core.setState(savedState)
    }

    // 监听设置变化
    this.on('state:change', (event) => {
      const state = event.payload as SettingsState
      // 同步到主题管理器
      this.themeManager.setTheme(state.theme)
      this.themeManager.toggleDarkMode()
      this.themeManager.toggleTransparency()
      this.themeManager.setAccentColor(state.accentColor)
      // 保存状态
      this.setState('state', state)
    })
  }

  async destroy(): Promise<void> {
    // 清理状态
    this.clearState('state')
  }

  // 获取设置状态
  getSettings(): SettingsState {
    return this.core.getState()
  }

  // 更新设置
  updateSettings(settings: Partial<SettingsState>): void {
    this.core.setState(settings)
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }

  // 重置设置
  resetSettings(): void {
    this.core.resetSettings()
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }

  // 导出设置
  exportSettings(): string {
    return this.core.exportSettings()
  }

  // 导入设置
  importSettings(settings: string): void {
    this.core.importSettings(settings)
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }
} 