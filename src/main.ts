import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import ApexCharts from 'apexcharts'

const app = createApp(App)
app.use(createPinia())
app.use(VueApexCharts)
app.use(router)
app.mount('#app')

app.config.globalProperties.$apexcharts = ApexCharts

// Add this when into a TypeScript codebase
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts
  }
}
