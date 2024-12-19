<template>
  <div class="taskbar">
    <div class="taskbar-start">
      <button class="start-button" @click="toggleStartMenu">
        <el-icon><Monitor /></el-icon>
      </button>
    </div>
    <div class="taskbar-apps">
      <button
        v-for="window in windows"
        :key="window.id"
        class="taskbar-app"
        :class="{ active: window.id === activeWindowId }"
        @click="toggleWindow(window)"
      >
        <el-icon><component :is="getIconComponent(window.icon)" /></el-icon>
      </button>
    </div>
    <div class="taskbar-tray">
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Monitor, Document, Setting } from '@element-plus/icons-vue'
import { useWindowManager } from '@corenas/services'
import { storeToRefs } from 'pinia'

const windowManager = useWindowManager()
const { windows, activeWindowId } = storeToRefs(windowManager)

const currentTime = ref(new Date().toLocaleTimeString())
const timeInterval = ref<NodeJS.Timeout>()

onMounted(() => {
  timeInterval.value = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
})

const toggleWindow = (window: any) => {
  if (window.id === activeWindowId.value && !window.minimized) {
    windowManager.minimizeWindow(window.id)
  } else {
    windowManager.activateWindow(window.id)
  }
}

const emit = defineEmits(['toggle-start'])

const toggleStartMenu = () => {
  emit('toggle-start')
}

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
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.taskbar-start {
  display: flex;
  align-items: center;
}

.start-button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.start-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.taskbar-apps {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.taskbar-app {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.taskbar-app::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: transparent;
  transition: background-color 0.2s;
}

.taskbar-app.active::after {
  background-color: #0078d4;
}

.taskbar-app:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.taskbar-app :deep(.el-icon) {
  font-size: 20px;
}

.taskbar-tray {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time {
  font-size: 12px;
  color: #000;
}

/* 深色模式 */
:deep(.dark) .taskbar {
  background-color: rgba(54, 54, 54, 0.9);
}

:deep(.dark) .start-button,
:deep(.dark) .taskbar-app,
:deep(.dark) .time {
  color: #fff;
}

:deep(.dark) .start-button:hover,
:deep(.dark) .taskbar-app:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 