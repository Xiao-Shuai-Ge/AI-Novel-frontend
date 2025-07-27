import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import './assets/tailwind.css'


// pinia
import { createPinia } from "pinia";
const pinia = createPinia();

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 复制粘贴
import VueClipboard from 'vue-clipboard3'

createApp(App)
    .use(pinia)
    .use(router)
    .use(ElementPlus)
    .use(VueClipboard)
    .mount('#app')
