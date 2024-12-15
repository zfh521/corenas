import { AppInfo } from '@corenas/core'
import { BaseApp, AppContext } from '../base/BaseApp'
import { AppLifecycle } from '../lifecycle/AppLifecycle'
import { Pinia } from 'pinia'

export interface AppModule {
  default: new (context: AppContext) => BaseApp
}

export class AppRegistry {
  private static instance: AppRegistry
  private lifecycle: AppLifecycle
  private appModules = new Map<string, () => Promise<AppModule>>()

  private constructor(pinia: Pinia) {
    this.lifecycle = AppLifecycle.getInstance(pinia)
  }

  static getInstance(pinia?: Pinia): AppRegistry {
    if (!AppRegistry.instance) {
      if (!pinia) {
        throw new Error('Pinia instance must be provided when initializing AppRegistry')
      }
      AppRegistry.instance = new AppRegistry(pinia)
    }
    return AppRegistry.instance
  }

  // 注册应用
  registerApp(appInfo: AppInfo, moduleLoader: () => Promise<AppModule>): void {
    this.lifecycle.registerApp(appInfo)
    this.appModules.set(appInfo.id, moduleLoader)
  }

  // 启动应用
  async startApp(appId: string): Promise<string> {
    const moduleLoader = this.appModules.get(appId)
    if (!moduleLoader) {
      throw new Error(`App ${appId} not registered`)
    }

    const module = await moduleLoader()
    return this.lifecycle.startApp(appId, module.default)
  }

  // 停止应用
  async stopApp(windowId: string): Promise<void> {
    await this.lifecycle.stopApp(windowId)
  }

  // 获取应用信息
  getAppInfo(appId: string): AppInfo | undefined {
    return this.lifecycle.getAppInfo(appId)
  }

  // 获取已注册的应用列表
  getRegisteredApps(): AppInfo[] {
    return this.lifecycle.getRegisteredApps()
  }

  // 获取运行中的应用列表
  getRunningApps() {
    return this.lifecycle.getRunningApps()
  }
} 