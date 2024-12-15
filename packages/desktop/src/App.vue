<template>
  <div class="app-container">
    <component :is="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeManager } from '@corenas/services'
import Win11Desktop from './components/Win11Desktop.vue'
import MacosDesktop from './components/MacosDesktop.vue'

const themeManager = useThemeManager()

const currentTheme = computed(() => 
  themeManager.theme === 'win11' ? Win11Desktop : MacosDesktop
)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100vh;
  overflow: hidden;
}

.app-container {
  position: relative;
  height: 100vh;
}

/* 深色模式样式 */
body.dark {
  background-color: #000;
  color: #fff;
}

body.dark .el-button {
  --el-button-bg-color: #363636;
  --el-button-text-color: #fff;
  --el-button-border-color: #4c4c4c;
  --el-button-hover-text-color: #fff;
  --el-button-hover-bg-color: #4c4c4c;
  --el-button-hover-border-color: #5c5c5c;
}

body.dark .el-card {
  --el-card-bg-color: #363636;
  color: #fff;
}
</style> 