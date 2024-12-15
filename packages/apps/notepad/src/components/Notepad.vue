<template>
  <div class="notepad">
    <div class="toolbar">
      <el-button-group>
        <el-button @click="handleNew">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          新建
        </el-button>
        <el-button @click="handleSave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
          </svg>
          保存
        </el-button>
      </el-button-group>
    </div>
    <div class="editor">
      <el-input
        v-model="content"
        type="textarea"
        :rows="2"
        class="editor-textarea"
        resize="none"
        @input="handleInput"
      />
    </div>
    <div class="status-bar">
      <span>{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NotepadApp } from '../NotepadApp'
import { NotepadState } from '../core/NotepadCore'

const props = defineProps<{
  app: NotepadApp
}>()

const state = ref<NotepadState>(props.app.getNotepadState())
const content = computed({
  get: () => state.value.content,
  set: (value) => handleInput(value)
})

const statusText = computed(() => {
  const { wordCount, lineCount, saved } = state.value
  return `${wordCount} 个字 | ${lineCount} 行${saved ? '' : ' | 未保存'}`
})

const handleInput = (value: string) => {
  props.app.setContent(value)
}

const handleNew = async () => {
  if (props.app.hasUnsavedChanges()) {
    const confirm = window.confirm('当前文件未保存，是否继续？')
    if (!confirm) return
  }
  props.app.newFile()
}

const handleSave = async () => {
  await props.app.saveFile()
}

// 监听状态变化
const handleStateChange = (event: any) => {
  state.value = event.payload
}

onMounted(() => {
  props.app.on('state:change', handleStateChange)
})

onUnmounted(() => {
  props.app.off('state:change', handleStateChange)
})
</script>

<style scoped>
.notepad {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.toolbar {
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.editor {
  flex: 1;
  overflow: hidden;
}

.editor-textarea {
  height: 100%;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px;
}

.status-bar {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}
</style> 