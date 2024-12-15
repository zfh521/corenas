import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WindowState, generateId, globalEventBus } from '@corenas/core'

export const useWindowManager = defineStore('windowManager', () => {
  const windows = ref<WindowState[]>([])
  const activeWindowId = ref<string | null>(null)
  const maxZIndex = ref(0)

  // 获取活动窗口
  const activeWindow = computed(() => 
    windows.value.find(w => w.id === activeWindowId.value)
  )

  // 添加窗口
  const addWindow = (window: Omit<WindowState, 'zIndex' | 'minimized' | 'maximized'>) => {
    const id = window.id || generateId()
    maxZIndex.value++
    const newWindow: WindowState = {
      ...window,
      id,
      minimized: false,
      maximized: false,
      zIndex: maxZIndex.value
    }
    windows.value.push(newWindow)
    activeWindowId.value = id

    globalEventBus.emit({
      type: 'window:add',
      payload: newWindow
    })

    return id
  }

  // 移除窗口
  const removeWindow = (id: string) => {
    const index = windows.value.findIndex(w => w.id === id)
    if (index !== -1) {
      const window = windows.value[index]
      windows.value.splice(index, 1)
      if (activeWindowId.value === id) {
        const lastWindow = windows.value[windows.value.length - 1]
        activeWindowId.value = lastWindow?.id || null
      }

      globalEventBus.emit({
        type: 'window:remove',
        payload: window
      })
    }
  }

  // 激活窗口
  const activateWindow = (id: string) => {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      maxZIndex.value++
      window.zIndex = maxZIndex.value
      activeWindowId.value = id
      window.minimized = false

      globalEventBus.emit({
        type: 'window:activate',
        payload: window
      })
    }
  }

  // 最小化窗口
  const minimizeWindow = (id: string) => {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      window.minimized = true
      if (activeWindowId.value === id) {
        const lastWindow = windows.value
          .filter(w => !w.minimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0]
        activeWindowId.value = lastWindow?.id || null
      }

      globalEventBus.emit({
        type: 'window:minimize',
        payload: window
      })
    }
  }

  // 最大化窗口
  const maximizeWindow = (id: string) => {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      window.maximized = !window.maximized

      globalEventBus.emit({
        type: 'window:maximize',
        payload: window
      })
    }
  }

  // 更新窗口位置
  const updateWindowPosition = (id: string, x: number, y: number) => {
    const window = windows.value.find(w => w.id === id)
    if (window && !window.maximized) {
      window.x = x
      window.y = y

      globalEventBus.emit({
        type: 'window:move',
        payload: { id, x, y }
      })
    }
  }

  // 更新窗口大小
  const updateWindowSize = (id: string, width: number, height: number) => {
    const window = windows.value.find(w => w.id === id)
    if (window && !window.maximized) {
      window.width = width
      window.height = height

      globalEventBus.emit({
        type: 'window:resize',
        payload: { id, width, height }
      })
    }
  }

  return {
    windows,
    activeWindowId,
    activeWindow,
    addWindow,
    removeWindow,
    activateWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize
  }
}) 