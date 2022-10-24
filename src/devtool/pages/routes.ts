import * as router from 'vue-router';

const routes: router.RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('./HomePage.vue'),
  },
];

export default routes;
