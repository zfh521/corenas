<template>
  <div class="desktop" :class="theme">
    <div class="windows">
      <slot name="windows" />
    </div>
    <slot name="start-menu" />
    <slot name="taskbar" />
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  theme: 'win11' | 'macos'
}>()

// 将主题类添加到body，用于全局样式调整
if (typeof document !== 'undefined') {
  document.body.className = props.theme
}
</script>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  background-image: url('/wallpapers/desktop.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.windows {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  pointer-events: none; /* 允许点击穿透到底层 */
}

.windows > * {
  pointer-events: auto; /* 恢复窗口的点击事件 */
}

.desktop.win11 .windows {
  top: 0;
  bottom: 40px;
}

.desktop.macos .windows {
  top: 24px; /* 菜单栏高度 */
  bottom: 0;
}

:deep(.menu-bar),
:deep(.dock) {
  position: fixed;
  z-index: 1000;
}

:deep(.menu-bar) {
  top: 0;
  left: 0;
  right: 0;
}

:deep(.dock) {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}
</style> 