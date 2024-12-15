import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { registerApps } from './apps'
import { initializeAppFramework } from '@corenas/app-framework'

import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)

// 初始化应用框架
initializeAppFramework(pinia)

// 注册应用
registerApps()

app.mount('#app') 