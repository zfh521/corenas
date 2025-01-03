import { AppInfo, globalEventBus } from '@corenas/core'
import { useWindowManager } from '@corenas/services'
import { BaseApp, AppContext } from '../base/BaseApp'
import { Pinia } from 'pinia'

export interface AppInstance {
  app: BaseApp
  info: AppInfo
  context: AppContext
}

export class AppLifecycle {
  private static instance: AppLifecycle
  private windowManager
  private runningApps = new Map<string, AppInstance>()
  private registeredApps = new Map<string, AppInfo>()

  private constructor(pinia: Pinia) {
    this.windowManager = useWindowManager(pinia)
    // 监听窗口关闭事件
    globalEventBus.on('window:remove', event => {
      const windowId = event.payload.id
      this.stopAppByWindowId(windowId)
    })
  }

  static getInstance(pinia?: Pinia): AppLifecycle {
    if (!AppLifecycle.instance) {
      if (!pinia) {
        throw new Error('Pinia instance must be provided when initializing AppLifecycle')
      }
      AppLifecycle.instance = new AppLifecycle(pinia)
    }
    return AppLifecycle.instance
  }

  // 注册应用
  registerApp(appInfo: AppInfo): void {
    this.registeredApps.set(appInfo.id, appInfo)
  }

  // 获取应用信息
  getAppInfo(appId: string): AppInfo | undefined {
    return this.registeredApps.get(appId)
  }

  // 启动应用
  async startApp(appId: string, AppClass: new (context: AppContext) => BaseApp): Promise<string> {
    const appInfo = this.registeredApps.get(appId)
    if (!appInfo) {
      throw new Error(`App ${appId} not registered`)
    }

    // 检查是否为单例应用且已经在运行
    if (appInfo.singleton) {
      const runningInstance = Array.from(this.runningApps.values()).find(
        instance => instance.info.id === appId
      )
      if (runningInstance) {
        // 如果已经在运行，激活该窗口并返回其 ID
        this.windowManager.activateWindow(runningInstance.context.windowId)
        return runningInstance.context.windowId
      }
    }

    // 创建窗口
    const windowId = `${appId}-${Date.now()}`
    const windowState = this.windowManager.addWindow({
      id: windowId,
      title: appInfo.name,
      icon: appInfo.icon,
      width: appInfo.defaultWidth,
      height: appInfo.defaultHeight,
      x: Math.random() * (window.innerWidth - appInfo.defaultWidth),
      y: Math.random() * (window.innerHeight - appInfo.defaultHeight)
    });

    // 创建应用实例
    const context: AppContext = { appId, windowId, windowState }
    const app = new AppClass(context)
    
    // 初始化应用
    await app.init()

    // 保存运行实例
    const instance: AppInstance = { app, info: appInfo, context }
    this.runningApps.set(windowId, instance)

    // 发送应用启动事件
    globalEventBus.emit({
      type: 'app:start',
      payload: { appId, windowId }
    })

    return windowId
  }

  // 停止应用
  async stopApp(windowId: string): Promise<void> {
    const instance = this.runningApps.get(windowId)
    if (instance) {
      await instance.app.destroy()
      this.runningApps.delete(windowId)
      this.windowManager.removeWindow(windowId)

      globalEventBus.emit({
        type: 'app:stop',
        payload: { 
          appId: instance.info.id,
          windowId 
        }
      })
    }
  }

  // 通过窗口ID停止��用
  private async stopAppByWindowId(windowId: string): Promise<void> {
    const instance = this.runningApps.get(windowId)
    if (instance) {
      await instance.app.destroy()
      this.runningApps.delete(windowId)

      globalEventBus.emit({
        type: 'app:stop',
        payload: { 
          appId: instance.info.id,
          windowId 
        }
      })
    }
  }

  // 获取运行中的应用列表
  getRunningApps(): AppInstance[] {
    return Array.from(this.runningApps.values())
  }

  // 获取已注册的应用列表
  getRegisteredApps(): AppInfo[] {
    return Array.from(this.registeredApps.values())
  }
} 