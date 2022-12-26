import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue';
import HomeView from '../views/HomeView.vue'

const SITE_TITLE = 'Snippt';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    {
      path: '/',
      name: 'Homepage',
      component: HomeView,
      meta: {
        title: "Home"
      }
    },

    // Auth
    {
      path: '/register',
      name: 'Register',
      component: () => import('%/auth/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('%/auth/LoginView.vue'),
      meta: {
        title: 'Log in'
      }
    },


    // Users
    {
      path: '/users/:handle',
      name: 'Profile',
      component: () => import('%/users/UserProfileView.vue'),
    }
  ]
});


// set title depending on page after every route change
router.afterEach((to, from) => {
  nextTick(() => {
    let title = to.meta.title as string || to.name as string || '';

    if (title) {
      title += ' | ';
    }

    title += SITE_TITLE;

    document.title = title;
  })
})

export default router
