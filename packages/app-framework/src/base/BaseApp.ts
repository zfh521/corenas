import { EventEmitter, Event, EventHandler, globalEventBus, WindowState } from '@corenas/core'
import { useStorageManager } from '@corenas/services'

export interface AppContext {
  appId: string
  windowId: string
  windowState: WindowState
}

export abstract class BaseApp implements EventEmitter {
  protected context: AppContext
  protected storage = useStorageManager()
  private eventHandlers = new Map<string, Set<EventHandler>>()

  constructor(context: AppContext) {
    this.context = context
  }

  // 事件系统实现
  emit(event: Event): void {
    const handlers = this.eventHandlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }
    // 发送到全局事件总线，添加应用上下文
    globalEventBus.emit({
      type: `app:${this.context.appId}:${event.type}`,
      payload: {
        ...event.payload,
        context: this.context
      }
    })
  }

  on(type: string, handler: EventHandler): void {
    let handlers = this.eventHandlers.get(type)
    if (!handlers) {
      handlers = new Set()
      this.eventHandlers.set(type, handlers)
    }
    handlers.add(handler)
  }

  off(type: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(type)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.eventHandlers.delete(type)
      }
    }
  }

  // 生命周期方法
  abstract init(): Promise<void>
  abstract destroy(): Promise<void>

  // 状态管理
  protected getState<T>(key: string): T | null {
    const stateKey = `${this.context.appId}:${key}`
    return this.storage.getItem(stateKey)
  }

  protected setState<T>(key: string, value: T, expiry?: number): void {
    const stateKey = `${this.context.appId}:${key}`
    this.storage.setItem(stateKey, value, expiry)
  }

  protected clearState(key: string): void {
    const stateKey = `${this.context.appId}:${key}`
    this.storage.removeItem(stateKey)
  }

  // 工具方法
  protected getAppId(): string {
    return this.context.appId
  }

  protected getWindowId(): string {
    return this.context.windowId
  }
} 