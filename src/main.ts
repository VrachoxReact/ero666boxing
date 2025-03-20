import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Import only necessary components from Element Plus instead of the whole library
import { 
  ElButton, 
  ElInput, 
  ElMessage, 
  ElTabs,
  ElTabPane, 
  ElForm, 
  ElFormItem, 
  ElSelect, 
  ElOption,
  ElRadio, 
  ElRadioGroup,
  ElSlider,
  ElCollapse, 
  ElCollapseItem,
  ElCheckbox
} from 'element-plus'
// Import only necessary styles
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/tabs/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/radio/style/css'
import 'element-plus/es/components/slider/style/css'
import 'element-plus/es/components/collapse/style/css'
import 'element-plus/es/components/checkbox/style/css'

import './style.css'
import App from './App.vue'
import router from './router'

// Create the Vue application
const app = createApp(App)

// Performance monitoring
if (import.meta.env.MODE === 'development') {
  app.config.performance = true
}

// Create Pinia (store) instance
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Register only needed Element Plus components
app.component('ElButton', ElButton)
app.component('ElInput', ElInput)
app.component('ElForm', ElForm)
app.component('ElFormItem', ElFormItem)
app.component('ElSelect', ElSelect)
app.component('ElOption', ElOption)
app.component('ElTabs', ElTabs)
app.component('ElTabPane', ElTabPane)
app.component('ElRadio', ElRadio)
app.component('ElRadioGroup', ElRadioGroup)
app.component('ElSlider', ElSlider)
app.component('ElCollapse', ElCollapse)
app.component('ElCollapseItem', ElCollapseItem)
app.component('ElCheckbox', ElCheckbox)

// Make ElMessage available globally
app.config.globalProperties.$message = ElMessage

// Set max batch size for updates to improve performance
app.config.performance = true

// Mount the application
router.isReady().then(() => {
  app.mount('#app')
})
