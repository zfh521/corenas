import { getAppRegistry, type AppInfo, type AppModule } from '@corenas/app-framework'

// 注册所有应用
export function registerApps() {
  const appRegistry = getAppRegistry()
  console.log('[Apps] Starting app registration...')
  
  // 定义应用列表
  const apps: AppInfo[] = [
    {
      id: 'calculator',
      name: '计算器',
      version: '1.0.0',
      icon: 'Calculator',
      component: 'Calculator',
      defaultWidth: 320,
      defaultHeight: 480,
      singleton: true
    },
    {
      id: 'notepad',
      name: '记事本',
      version: '1.0.0',
      icon: 'Document',
      component: 'Notepad',
      defaultWidth: 600,
      defaultHeight: 400,
      singleton: false
    },
    {
      id: 'settings',
      name: '设置',
      version: '1.0.0',
      icon: 'Setting',
      component: 'Settings',
      defaultWidth: 800,
      defaultHeight: 600,
      singleton: true
    },
    {
      id: 'finder',
      name: 'Finder',
      version: '1.0.0',
      icon: 'Setting',
      component: 'Settings',
      defaultWidth: 800,
      defaultHeight: 600,
      singleton: true
    }
  ]

  console.log('[Apps] Defined apps:', apps)
  function loadScript(id: string): Promise<AppModule> {
    switch (id) {
      case "calculator":
        return import("@corenas/calculator") as Promise<AppModule>
      case "notepad":
        return import("@corenas/notepad") as Promise<AppModule>
      case "settings":
        return import("@corenas/settings") as Promise<AppModule>
      case "finder":
        return import("@corenas/finder") as Promise<AppModule>
      default:
        return Promise.reject(new Error(`Unknown app id: ${id}`))
    }
  }
  // 注册每个应用
  apps.forEach(app => {
    console.log(`[Apps] Registering app: ${app.id}`)
    try {
      appRegistry.registerApp(app, () => {
        console.log(`[Apps] Loading module for app: ${app.id}`)
        /* @vite-ignore */
        return loadScript(app.id)
      })
      console.log(`[Apps] Successfully registered app: ${app.id}`)
    } catch (error) {
      console.error(`[Apps] Failed to register app ${app.id}:`, error)
    }
  })
  
  console.log('[Apps] All apps registered')
  console.log('[Apps] Registered apps:', appRegistry.getRegisteredApps())
} 