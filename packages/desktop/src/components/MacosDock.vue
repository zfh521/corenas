<template>
  <div class="dock">
    <div class="dock-apps">
      <button
        v-for="app in apps"
        :key="app.id"
        class="dock-app"
        @click="launchApp(app)"
      >
        <el-icon>
          <component :is="getIconComponent(app.icon)" />
        </el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Document, Monitor, Setting } from '@element-plus/icons-vue'
import { getAppRegistry } from '@corenas/app-framework'

const appRegistry = getAppRegistry()

// 获取已注册的应用列表
const apps = computed(() => {
  return appRegistry.getRegisteredApps().map(app => ({
    id: app.id,
    title: app.name,
    icon: app.icon,
    component: app.component
  }))
})

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

const launchApp = async (app: any) => {
  console.log(`[Dock] Launching app: ${app.id}`)
  try {
    const windowId = await appRegistry.startApp(app.id)
    console.log(`[Dock] App ${app.id} launched with window ID: ${windowId}`)
  } catch (error) {
    console.error(`[Dock] Failed to launch app ${app.id}:`, error)
  }
}
</script>

<style scoped>
.dock {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.dock-apps {
  display: flex;
  gap: 4px;
}

.dock-app {
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.dock-app:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.dock-app :deep(.el-icon) {
  font-size: 32px;
  color: #000;
}

/* 深色模式 */
:deep(.dark) .dock {
  background-color: rgba(54, 54, 54, 0.9);
}

:deep(.dark) .dock-app :deep(.el-icon) {
  color: #fff;
}

:deep(.dark) .dock-app:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 