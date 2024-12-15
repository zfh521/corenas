// 导出基础类型和接口
export * from './base/BaseApp'
export { type AppInfo } from '@corenas/core'

// 导出生命周期管理
export * from './lifecycle/AppLifecycle'

// 导出应用注册
export * from './registry/AppRegistry'

// 创建并导出全局应用注册表实例
import { AppRegistry } from './registry/AppRegistry'
import { Pinia } from 'pinia'

let globalRegistry: AppRegistry | null = null

export function initializeAppFramework(pinia: Pinia): AppRegistry {
  if (!globalRegistry) {
    globalRegistry = AppRegistry.getInstance(pinia)
  }
  return globalRegistry
}

export function getAppRegistry(): AppRegistry {
  if (!globalRegistry) {
    throw new Error('App framework has not been initialized. Call initializeAppFramework first.')
  }
  return globalRegistry
} 