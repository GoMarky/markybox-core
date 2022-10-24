import * as router from 'vue-router';

import routes from './routes';

const _router = router.createRouter({
  history: router.createWebHashHistory(),
  routes,
});

export default _router;
