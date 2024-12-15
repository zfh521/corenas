<template>
  <BaseDesktop theme="win11">
    <template #windows>
      <Window
        v-for="window in windows"
        :key="window.id"
        :window="window"
        :is-active="window.id === activeWindowId"
      />
    </template>
    <template #start-menu>
      <Win11StartMenu v-model="showStartMenu" />
    </template>
    <template #taskbar>
      <Win11Taskbar @toggle-start="showStartMenu = !showStartMenu" />
    </template>
  </BaseDesktop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWindowManager } from '@corenas/services'
import { storeToRefs } from 'pinia'
import BaseDesktop from './BaseDesktop.vue'
import Window from './Window.vue'
import Win11StartMenu from './Win11StartMenu.vue'
import Win11Taskbar from './Win11Taskbar.vue'

const windowManager = useWindowManager()
const { windows, activeWindowId } = storeToRefs(windowManager)
const showStartMenu = ref(false)
</script>

<style scoped>
.desktop {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0078D4;
  color: white;
}
</style> 