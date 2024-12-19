<template>
  <div v-if="isVisible" class="start-menu" @click.self="close">
    <div class="start-menu-content" :class="{ show: isVisible }">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索应用"
          :prefix-icon="Search"
        />
      </div>
      <div class="apps-grid">
        <button
          v-for="app in filteredApps"
          :key="app.id"
          class="app-item"
          @click="launchApp(app)"
        >
          <el-icon><component :is="getIconComponent(app.icon)" /></el-icon>
          <span>{{ app.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Document, Monitor, Setting } from '@element-plus/icons-vue'
import { getAppRegistry } from '@corenas/app-framework'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const appRegistry = getAppRegistry()
const searchQuery = ref('')
const isVisible = ref(false)

// Watch modelValue changes
watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue
  if (!newValue) {
    // Clear search when menu closes
    searchQuery.value = ''
  }
})

// 获取已注册的应用列表
const apps = computed(() => {
  return appRegistry.getRegisteredApps().map(app => ({
    id: app.id,
    title: app.name,
    icon: app.icon,
    component: app.component
  }))
})

const filteredApps = computed(() => {
  if (!searchQuery.value) return apps.value
  const query = searchQuery.value.toLowerCase()
  return apps.value.filter(app => 
    app.title.toLowerCase().includes(query)
  )
})

const launchApp = async (app: any) => {
  await appRegistry.startApp(app.id)
  close()
}

const close = () => {
  isVisible.value = false
  emit('update:modelValue', false)
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
.start-menu {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999;
}

.start-menu-content {
  width: 600px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 8px 8px 0 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  width: 100%;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding: 8px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.app-item :deep(.el-icon) {
  font-size: 24px;
}

.app-item span {
  font-size: 12px;
  color: #000;
  text-align: center;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.7);
}

/* 深色模式 */
:deep(.dark) .start-menu-content {
  background-color: rgba(54, 54, 54, 0.9);
}

:deep(.dark) .app-item span {
  color: #fff;
}

:deep(.dark) .app-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 