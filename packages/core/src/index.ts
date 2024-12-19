// 导出类型定义
export * from './types'

// 导出事件系统
export * from './events/EventBus'

// 导出工具函数
export * from './utils'

// 创建全局事件总线实例
import { EventBus } from './events/EventBus'
export const globalEventBus = new EventBus() 

// 导出文件系统相关
export * from './types/filesystem';
export * from './filesystem'; 