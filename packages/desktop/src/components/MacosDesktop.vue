<template>
  <BaseDesktop theme="macos">
    <template #windows>
      <Window
        v-for="window in windows"
        :key="window.id"
        :window="window"
        :is-active="window.id === activeWindowId"
      />
    </template>
    <template #taskbar>
      <MacosMenuBar />
      <MacosDock />
    </template>
  </BaseDesktop>
</template>

<script setup lang="ts">
import { useWindowManager } from '@corenas/services'
import { storeToRefs } from 'pinia'
import BaseDesktop from './BaseDesktop.vue'
import Window from './Window.vue'
import MacosMenuBar from './MacosMenuBar.vue'
import MacosDock from './MacosDock.vue'

const windowManager = useWindowManager()
const { windows, activeWindowId } = storeToRefs(windowManager)
</script>

<style scoped>
.desktop {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: white;
}
</style> 