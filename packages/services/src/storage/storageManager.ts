import { defineStore } from 'pinia'
import { ref } from 'vue'
import { globalEventBus } from '@corenas/core'

export interface StorageItem {
  key: string
  value: any
  timestamp: number
  expiry?: number // 过期时间（毫秒）
}

export const useStorageManager = defineStore('storageManager', () => {
  const storage = ref<Map<string, StorageItem>>(new Map())

  // 设置数据
  const setItem = (key: string, value: any, expiry?: number) => {
    const item: StorageItem = {
      key,
      value,
      timestamp: Date.now(),
      expiry
    }

    storage.value.set(key, item)
    
    // 如果需要持久化，也保存到localStorage
    try {
      localStorage.setItem(key, JSON.stringify(item))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }

    globalEventBus.emit({
      type: 'storage:set',
      payload: item
    })
  }

  // 获取数据
  const getItem = (key: string): any => {
    // 先从内存中获取
    let item = storage.value.get(key)

    // 如果内存中没有，尝试从localStorage获取
    if (!item) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const parsedItem = JSON.parse(stored) as StorageItem
          if (isValidStorageItem(parsedItem)) {
            item = parsedItem
            storage.value.set(key, item)
          }
        } catch (e) {
          console.error('Failed to parse stored item:', e)
        }
      }
    }

    // 检查是否过期
    if (item) {
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        removeItem(key)
        return null
      }
      return item.value
    }

    return null
  }

  // 移除数据
  const removeItem = (key: string) => {
    storage.value.delete(key)
    localStorage.removeItem(key)

    globalEventBus.emit({
      type: 'storage:remove',
      payload: { key }
    })
  }

  // 清空数据
  const clear = () => {
    storage.value.clear()
    localStorage.clear()

    globalEventBus.emit({
      type: 'storage:clear',
      payload: null
    })
  }

  // 获取所有键
  const keys = (): string[] => {
    return Array.from(storage.value.keys())
  }

  // 验证存储项是否有效
  const isValidStorageItem = (item: any): item is StorageItem => {
    return (
      item &&
      typeof item === 'object' &&
      'key' in item &&
      'value' in item &&
      'timestamp' in item &&
      typeof item.timestamp === 'number'
    )
  }

  return {
    setItem,
    getItem,
    removeItem,
    clear,
    keys
  }
}) 