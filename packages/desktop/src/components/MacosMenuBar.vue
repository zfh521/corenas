<template>
  <div class="menu-bar">
    <div class="menu-bar-left">
      <button class="menu-item apple-menu">
        <el-icon><Apple /></el-icon>
      </button>
      <button class="menu-item">文件</button>
      <button class="menu-item">编辑</button>
      <button class="menu-item">视图</button>
      <button class="menu-item">窗口</button>
      <button class="menu-item">帮助</button>
    </div>
    <div class="menu-bar-right">
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Apple } from '@element-plus/icons-vue'

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
</script>

<style scoped>
.menu-bar {
  height: 24px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 13px;
  -webkit-app-region: drag;
}

.menu-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-item {
  border: none;
  background: transparent;
  padding: 0 8px;
  height: 24px;
  display: flex;
  align-items: center;
  color: #000;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.apple-menu {
  padding: 0;
  width: 24px;
}

.menu-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time {
  font-size: 12px;
  color: #000;
  -webkit-app-region: no-drag;
}

/* 深色模式 */
:deep(.dark) .menu-bar {
  background-color: rgba(54, 54, 54, 0.9);
}

:deep(.dark) .menu-item,
:deep(.dark) .time {
  color: #fff;
}

:deep(.dark) .menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 