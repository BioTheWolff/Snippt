import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue';
import PostFeedView from '%/posts/PostFeedView.vue';

const SITE_TITLE = 'Snippt';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    {
      path: '/',
      name: 'homepage',
      component: PostFeedView,
      meta: {
        title: "Home"
      }
    },

    // Auth
    {
      path: '/register',
      name: 'register',
      component: () => import('%/auth/RegisterView.vue'),
      meta: {
        title: 'Register'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('%/auth/LoginView.vue'),
      meta: {
        title: 'Log in'
      }
    },


    // Users
    {
      path: '/users/:handle',
      name: 'profile',
      component: () => import('%/users/UserProfileView.vue'),
    },
    {
      path: '/users/:handle/settings',
      name: 'user-settings',
      component: () => import('%/users/UserSettingsView.vue'),
      meta: {
        title: 'User settings'
      }
    },

    // Posts & Feed
    {
      path: '/posts/new',
      name: 'new-post',
      component: () => import('%/posts/PostCreateView.vue'),
      meta: {
        title: 'New post'
      }
    },
    {
      path: '/posts/:id',
      name: 'view-post',
      component: () => import('%/posts/PostFocusView.vue'),
      meta: {
        title: 'post'
      }
    },
    {
      path: '/posts/:id/answer',
      name: 'answer-post',
      component: () => import('%/posts/PostAnswerView.vue'),
      meta: {
        title: 'Answer post'
      }
    },

    // Admin
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('%/admin/AdminUsers.vue'),
      meta: {
        title: 'Users list'
      }
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
