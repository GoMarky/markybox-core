import { createApp } from 'vue';

import router from '@/devtool/pages/router';
import App from './App.vue';

import 'reset.css';
import '@/core/styles/marky.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
