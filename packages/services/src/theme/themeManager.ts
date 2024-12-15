import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { SystemSettings, ThemeType, globalEventBus } from '@corenas/core'

const STORAGE_KEY = 'system-settings'

// 从localStorage读取保存的设置
const getSavedSettings = (): Partial<SystemSettings> => {
  const settings = localStorage.getItem(STORAGE_KEY)
  if (settings) {
    try {
      return JSON.parse(settings)
    } catch (e) {
      console.error('Failed to parse saved settings:', e)
    }
  }
  return {}
}

export const useThemeManager = defineStore('themeManager', () => {
  const savedSettings = getSavedSettings()
  
  const theme = ref<ThemeType>(savedSettings.theme || 'win11')
  const darkMode = ref(savedSettings.darkMode ?? false)
  const transparency = ref(savedSettings.transparency ?? true)
  const accentColor = ref(savedSettings.accentColor || '#0078D4')

  // 监听设置变化并保存到localStorage
  watch(
    [theme, darkMode, transparency, accentColor],
    () => {
      const settings: SystemSettings = {
        theme: theme.value,
        darkMode: darkMode.value,
        transparency: transparency.value,
        accentColor: accentColor.value
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

      // 更新body的class
      if (typeof document !== 'undefined') {
        document.body.className = theme.value
        if (darkMode.value) {
          document.body.classList.add('dark')
        } else {
          document.body.classList.remove('dark')
        }
      }

      globalEventBus.emit({
        type: 'theme:change',
        payload: settings
      })
    },
    { deep: true }
  )

  // 切换主题
  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
  }

  // 切换暗色模式
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }

  // 切换透明效果
  const toggleTransparency = () => {
    transparency.value = !transparency.value
  }

  // 设置主题色
  const setAccentColor = (color: string) => {
    accentColor.value = color
  }

  return {
    theme,
    darkMode,
    transparency,
    accentColor,
    setTheme,
    toggleDarkMode,
    toggleTransparency,
    setAccentColor
  }
}) 