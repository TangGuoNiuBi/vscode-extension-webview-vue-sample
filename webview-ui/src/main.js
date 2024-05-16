import { createApp } from 'vue'
import router from './router'
import store from './store'
// elementplus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from "@tsparticles/vue3"
// 引入精简版，会导致后面想切换例子效果失败
// import { loadSlim } from "@tsparticles/slim"
// 最好引入完整版
// import { loadFull } from "tsparticles"
// 如果要引入预设例子效果，需要下载对应的特效的预设库，我这里引入的是烟花特效
import { loadFireworksPreset } from '@tsparticles/preset-fireworks'
import App from './App.vue'

const app = createApp(App)
app.use(router)
    .use(store)
    .use(ElementPlus)
    .use(Particles, {
        init: async engine => {
            // await loadFull(engine)
            await loadFireworksPreset(engine);
        },
    })
    .mount('#app')
