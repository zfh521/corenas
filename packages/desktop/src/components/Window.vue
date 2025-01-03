<template>
  <div
    v-show="!window.minimized"
    class="window"
    :class="{ active: isActive, maximized: window.maximized }"
    :style="windowStyle"
    @mousedown="activateWindow"
  >
    <div
      class="window-titlebar"
      @mousedown.prevent="startDrag"
      @dblclick="maximizeWindow"
    >
      <div class="window-titlebar-left">
        <el-icon class="window-icon"><component :is="getIconComponent(window.icon)" /></el-icon>
        <span class="window-title">{{ window.title }}</span>
      </div>
      <div class="window-controls">
        <button class="control-button minimize" @click.stop="minimizeWindow">
          <el-icon><Minus /></el-icon>
        </button>
        <button class="control-button maximize" @click.stop="maximizeWindow">
          <el-icon><FullScreen /></el-icon>
        </button>
        <button class="control-button close" @click.stop="closeWindow">
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </div>
    <div class="window-content">
      <Suspense>
        <template #default>
          <component 
            :is="appComponent" 
            v-if="appComponent && app" 
            :app="app" 
          />
        </template>
        <template #fallback>
          <div class="loading">
            <el-icon class="loading-icon"><Loading /></el-icon>
            加载中...
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, onUnmounted, shallowRef, onMounted, defineAsyncComponent } from 'vue'
import { Minus, FullScreen, Close, Loading, Document, Monitor, Setting } from '@element-plus/icons-vue'
import { useWindowManager } from '@corenas/services'
import { type WindowState } from '@corenas/core'
import { getAppRegistry } from '@corenas/app-framework'

const props = defineProps<{
  window: WindowState
  isActive: boolean
}>()

const windowManager = useWindowManager()
const appRegistry = getAppRegistry()

const windowStyle = computed(() => {
  if (props.window.maximized) {
    return {
      zIndex: props.window.zIndex,
      width: '100%',
      height: document.body.className === 'macos' ? 'calc(100% - 64px)' : 'calc(100% - 40px)',
      top: document.body.className === 'macos' ? '24px' : '0',
      left: '0',
      transform: 'none',
    }
  }
  return {
    zIndex: props.window.zIndex,
    width: `${props.window.width}px`,
    height: `${props.window.height}px`,
    transform: `translate(${props.window.x}px, ${props.window.y}px)`,
  }
})

const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
let animationFrame: number | null = null

const startDrag = (e: MouseEvent) => {
  if (!props.window.maximized) {
    dragging.value = true
    dragOffset.value = {
      x: e.clientX - props.window.x,
      y: e.clientY - props.window.y
    }
    document.addEventListener('mousemove', onDrag, { passive: true })
    document.addEventListener('mouseup', stopDrag)
  }
}

const onDrag = (e: MouseEvent) => {
  if (dragging.value) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    animationFrame = requestAnimationFrame(() => {
      const x = e.clientX - dragOffset.value.x
      const y = e.clientY - dragOffset.value.y
      windowManager.updateWindowPosition(props.window.id, x, y)
    })
  }
}

const stopDrag = () => {
  dragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

const activateWindow = () => {
  windowManager.activateWindow(props.window.id)
}

const minimizeWindow = () => {
  windowManager.minimizeWindow(props.window.id)
}

const maximizeWindow = () => {
  windowManager.maximizeWindow(props.window.id)
}

const closeWindow = () => {
  windowManager.removeWindow(props.window.id)
}

// 动态加载应用组件
const appComponent = shallowRef()
const app = shallowRef()

// 获取图标组件
const getIconComponent = (icon: string | undefined) => {
  switch (icon) {
    case 'Calculator':
      return Monitor
    case 'Document':
      return Document
    case 'Setting':
      return Setting
    default:
      return Document
  }
}

onMounted(async () => {
  // 从窗口ID中提取应用ID
  const appId = props.window.id.split('-')[0]
  console.log(`[Window] Loading app ${appId} in window ${props.window.id}`)
  const appInfo = appRegistry.getAppInfo(appId)
  
  if (appInfo) {
    try {
      let AppClass
      let Component
      console.log(`[Window] Found app info for ${appId}:`, appInfo)

      // 根据应用ID动态导入
      console.log(`[Window] Importing module for ${appId}...`)
      const module = appRegistry.getAppModule(appId)
      if (module) {
        const t = await module()
        AppClass = t.default
        Component = t.UI
      }
      console.log(`[Window] Module imported for ${appId}`)
      console.log(`[Window] Module imported for ${appId}`)

      // 创建应用例
      if (AppClass) {
        console.log(`[Window] Creating app instance for ${appId}...`)
        app.value = new AppClass({ 
          appId, 
          windowId: props.window.id,
          windowState: props.window
        })
        console.log(`[Window] Initializing app ${appId}...`)
        await app.value.init()
        console.log(`[Window] App ${appId} initialized`)
      }

      // 设置组件
      if (Component) {
        console.log(`[Window] Setting up component for ${appId}...`)
        appComponent.value = defineAsyncComponent({
          loader: async () => {
            console.log(`[Window] Loading component for ${appId}...`)
            const comp = await Component
            console.log(`[Window] Component loaded for ${appId}`)
            return comp
          },
          loadingComponent: {
            template: `
              <div class="loading">
                <el-icon class="loading-icon"><Loading /></el-icon>
                加载中...
              </div>
            `
          }
        })
      }
    } catch (e) {
      console.error(`[Window] Failed to load app ${appId}:`, e)
    }
  } else {
    console.error(`[Window] No app info found for ${appId}`)
  }
})

onUnmounted(async () => {
  if (app.value) {
    console.log(`[Window] Destroying app ${props.window.id}...`)
    await app.value.destroy()
    console.log(`[Window] App ${props.window.id} destroyed`)
  }
})
</script>

<style scoped>
.window {
  position: fixed;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease-out, height 0.2s ease-out;
  backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.9);
  transform-origin: 0 0;
  will-change: transform;
  top: 0;
  left: 0;
}

.window.active {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.window.maximized {
  border-radius: 0;
}

.window-titlebar {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  user-select: none;
  -webkit-app-region: drag;
}

.window-titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
}

.window-icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  color: #666;
}

.window-title {
  font-size: 12px;
  color: #000;
}

.window-controls {
  display: flex;
  gap: 2px;
  -webkit-app-region: no-drag;
}

.control-button {
  width: 46px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #000;
}

.control-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.control-button.close:hover {
  background-color: #e81123;
  color: #fff;
}

.window-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* 深色模式 */
:deep(.dark) .window {
  background-color: rgba(54, 54, 54, 0.9);
  color: #fff;
}

:deep(.dark) .window-titlebar {
  background-color: rgba(54, 54, 54, 0.9);
}

:deep(.dark) .window-title {
  color: #fff;
}

:deep(.dark) .control-button {
  color: #fff;
}

:deep(.dark) .control-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.dark) .control-button.close:hover {
  background-color: #e81123;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  gap: 8px;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 