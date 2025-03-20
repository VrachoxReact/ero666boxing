import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

// Use dynamic imports with better code splitting strategies
// Define routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import(/* webpackChunkName: "courses" */ '../views/CoursesView.vue'),
    meta: { title: 'All Courses' },
    // Prefetch the course detail component since it's likely to be needed next
    beforeEnter: () => {
      const prefetchCourseDetail = import(/* webpackChunkName: "course-detail", webpackPrefetch: true */ '../views/CourseDetailView.vue')
      return true
    }
  },
  {
    path: '/courses/:id',
    name: 'course-detail',
    component: () => import(/* webpackChunkName: "course-detail" */ '../views/CourseDetailView.vue'),
    meta: { title: 'Course Details' },
    // Prefetch the cart component for potential add to cart action
    beforeEnter: () => {
      const prefetchCart = import(/* webpackChunkName: "cart", webpackPrefetch: true */ '../views/CartView.vue')
      return true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: { title: 'About Us' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue'),
    meta: { title: 'Contact Us' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/CartView.vue'),
    meta: { title: 'Shopping Cart' },
    // Prefetch checkout since it's likely the next step
    beforeEnter: () => {
      const prefetchCheckout = import(/* webpackChunkName: "checkout", webpackPrefetch: true */ '../views/CheckoutView.vue')
      return true
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/CheckoutView.vue'),
    meta: { 
      title: 'Checkout',
      requiresAuth: false, // Set to true when authentication is implemented
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/AuthView.vue'),
    meta: { title: 'Sign In / Register' }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/AccountView.vue'),
    meta: { 
      title: 'My Account',
      requiresAuth: true
    }
  },
  // Add a catchall 404 page
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Use native browser behavior if there's a saved position
    if (savedPosition) {
      return savedPosition
    }
    
    // If navigation is triggered by a link with hash, scroll to the hash element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    
    // Otherwise, scroll to top smoothly
    return { 
      top: 0,
      behavior: 'smooth'
    }
  }
})

// Performance optimization - avoid unnecessary store operations on each navigation
let userStoreInstance: ReturnType<typeof useUserStore> | null = null

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = `${to.meta.title || 'Page'} | Erik Pijetraj's Boxing Academy`
  
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Initialize store instance only once
    userStoreInstance = userStoreInstance || useUserStore()
    
    // If not logged in, redirect to auth page
    if (!userStoreInstance.isLoggedIn) {
      // Store the path to redirect to after login
      localStorage.setItem('redirectAfterLogin', to.fullPath)
      
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// Add back button support that maintains scroll position
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto'
}

export default router 