<template>
  <div class="settings">
    <el-menu class="settings-menu" :default-active="activeMenu">
      <el-menu-item index="system" @click="activeMenu = 'system'">
        <el-icon><Monitor /></el-icon>
        <span>系统</span>
      </el-menu-item>
      <el-menu-item index="personalization" @click="activeMenu = 'personalization'">
        <el-icon><Brush /></el-icon>
        <span>个性化</span>
      </el-menu-item>
      <el-menu-item index="language" @click="activeMenu = 'language'">
        <el-icon><ChatDotRound /></el-icon>
        <span>语言</span>
      </el-menu-item>
      <el-menu-item index="sound" @click="activeMenu = 'sound'">
        <el-icon><Bell /></el-icon>
        <span>声音</span>
      </el-menu-item>
      <el-menu-item index="about" @click="activeMenu = 'about'">
        <el-icon><InfoFilled /></el-icon>
        <span>关于</span>
      </el-menu-item>
    </el-menu>
    
    <div class="settings-content">
      <template v-if="activeMenu === 'system'">
        <h2>系统设置</h2>
        <el-form label-width="120px">
          <el-form-item label="系统题">
            <el-radio-group v-model="settings.theme" @change="updateSettings">
              <el-radio label="win11">Windows 11</el-radio>
              <el-radio label="macos">macOS</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="显示模式">
            <el-radio-group v-model="settings.darkMode" @change="updateSettings">
              <el-radio :label="false">浅色</el-radio>
              <el-radio :label="true">深色</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="透明效果">
            <el-switch v-model="settings.transparency" @change="updateSettings" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-slider
              v-model="settings.fontSize"
              :min="12"
              :max="20"
              :step="1"
              show-input
              @change="updateSettings"
            />
          </el-form-item>
        </el-form>
      </template>

      <template v-if="activeMenu === 'personalization'">
        <h2>个性化设置</h2>
        <el-form label-width="120px">
          <el-form-item label="主题色">
            <el-color-picker v-model="settings.accentColor" @change="updateSettings" />
          </el-form-item>
          <el-form-item label="背景图片">
            <el-upload
              class="wallpaper-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              @change="handleWallpaperChange"
            >
              <el-button type="primary">选择图片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>

      <template v-if="activeMenu === 'language'">
        <h2>语言设置</h2>
        <el-form label-width="120px">
          <el-form-item label="系统语言">
            <el-select v-model="settings.language" @change="updateSettings">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="English" value="en-US" />
              <el-option label="日本語" value="ja-JP" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template v-if="activeMenu === 'sound'">
        <h2>声音设置</h2>
        <el-form label-width="120px">
          <el-form-item label="系统声音">
            <el-switch v-model="settings.soundEnabled" @change="updateSettings" />
          </el-form-item>
          <el-form-item label="通知提醒">
            <el-switch v-model="settings.notificationsEnabled" @change="updateSettings" />
          </el-form-item>
        </el-form>
      </template>

      <template v-if="activeMenu === 'about'">
        <h2>关于系统</h2>
        <div class="about-content">
          <p><strong>版本：</strong> 1.0.0</p>
          <p><strong>构建时间：</strong> {{ new Date().toLocaleDateString() }}</p>
          <p><strong>技术栈：</strong> Vue 3 + TypeScript + Vite</p>
          <div class="action-buttons">
            <el-button type="primary" @click="exportSettings">导出设置</el-button>
            <el-button type="primary" @click="importSettingsClick">导入设置</el-button>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept=".json"
              @change="handleFileImport"
            >
            <el-button type="danger" @click="resetSettings">重置设置</el-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Monitor,
  Brush,
  ChatDotRound,
  Bell,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { SettingsApp } from '../SettingsApp'
import { SettingsState } from '../core/SettingsCore'

const props = defineProps<{
  app: SettingsApp
}>()

const activeMenu = ref('system')
const settings = ref<SettingsState>(props.app.getSettings())
const fileInput = ref<HTMLInputElement | null>(null)

// 更新设置
const updateSettings = () => {
  props.app.updateSettings(settings.value)
}

// 处理壁纸更改
const handleWallpaperChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      localStorage.setItem(`wallpaper-${settings.value.theme}`, e.target.result as string)
      document.body.style.backgroundImage = `url(${e.target.result})`
      ElMessage.success('壁纸已更新')
    }
  }
  reader.readAsDataURL(file.raw)
}

// 导出设置
const exportSettings = () => {
  const data = props.app.exportSettings()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('设置已导出')
}

// 导入设置
const importSettingsClick = () => {
  fileInput.value?.click()
}

const handleFileImport = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          props.app.importSettings(e.target.result as string)
          ElMessage.success('设置已导入')
        } catch (error) {
          ElMessage.error('导入设置失败')
        }
      }
    }
    reader.readAsText(file)
  }
}

// 重置设置
const resetSettings = () => {
  props.app.resetSettings()
  ElMessage.success('设置已重置')
}

// 监听状态变化
const handleStateChange = (event: any) => {
  settings.value = event.payload
}

onMounted(() => {
  props.app.on('state:change', handleStateChange)
})

onUnmounted(() => {
  props.app.off('state:change', handleStateChange)
})
</script>

<style scoped>
.settings {
  height: 100%;
  display: flex;
  background-color: white;
}

.settings-menu {
  width: 200px;
  border-right: 1px solid #e0e0e0;
}

.settings-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

h2 {
  margin-bottom: 20px;
  font-weight: 500;
}

.about-content {
  line-height: 2;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

.wallpaper-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 深色模式适配 */
:deep(.dark) {
  .settings {
    background-color: #363636;
    color: #fff;
  }

  .settings-menu {
    border-right-color: #4c4c4c;
  }

  .el-menu {
    background-color: #363636;
    border-right: none;
  }

  .el-menu-item {
    color: #fff;
  }

  .el-menu-item:hover {
    background-color: #4c4c4c;
  }

  .el-menu-item.is-active {
    background-color: #4c4c4c;
  }
}
</style> 