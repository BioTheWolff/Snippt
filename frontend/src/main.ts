import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import Oruga from '@oruga-ui/oruga-next'

// local init files
import App from './App.vue'
import router from './router'

// global styles
import './assets/styles/_bulma_override.sass'
import './assets/styles/_all.sass'

// fontawesome icons
import { fas } from './fas-load';

// app init
const app = createApp(App)

app.use(createPinia())

app.component("vue-fontawesome", fas);
app.use(Oruga, {
    ...bulmaConfig,
    iconComponent: "vue-fontawesome",
    iconPack: "fas"
});

app.use(router)

app.mount('#app')
