import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { bulmaConfig } from '@oruga-ui/theme-bulma'
import Oruga from '@oruga-ui/oruga-next'

// local init files
import App from './App.vue'
import router from './router'
import { hydrateStores } from './stores/_all'

// global styles
import './assets/styles/_bulma_override.sass'
import './assets/styles/_all.sass'

// fontawesome icons
import { fas } from './fas-load';


// app init
const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.component("vue-fontawesome", fas);
app.use(Oruga, {
    ...bulmaConfig,
    iconComponent: "vue-fontawesome",
    iconPack: "fas"
});

app.config.globalProperties.window = window
app.use(router)

app.mount('#app')


// hydrate stores as soon as the app is ready
hydrateStores();