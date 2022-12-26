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
      meta: {
        title: 'Register'
      }
    },


    // Users
    {
      path: '/users/:handle',
      name: 'Profile',
      component: () => import('%/users/UserProfileView.vue'),
      meta: {
        title: "Profile"
      }
    }
  ]
});


// set title depending on page after every route change
router.afterEach((to, from) => {
  nextTick(() => {
    let title = '';
    if (to.meta.title) {
      title = `${to.meta.title} | `;
    }
    title += SITE_TITLE;

    document.title = title;
  })
})

export default router
