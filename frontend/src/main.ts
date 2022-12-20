import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import Oruga from '@oruga-ui/oruga-next'

// local init files
import App from './App.vue'
import router from './router'

// global styles
import '@oruga-ui/theme-bulma/dist/bulma.css'


// app init
const app = createApp(App)

app.use(createPinia())
app.use(Oruga, bulmaConfig);
app.use(router)

app.mount('#app')
