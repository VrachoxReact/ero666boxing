<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useUserStore } from '../../stores/userStore'
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const lastScrollPosition = ref(0)
const showHeader = ref(true)

const cartCount = computed(() => cartStore.cartCount)
const isLoggedIn = computed(() => userStore.isLoggedIn)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navigateTo = (path: string) => {
  router.push(path)
  closeMenu()
}

// Handle scroll behavior
const handleScroll = () => {
  const currentScrollPosition = window.scrollY

  // Add scroll class when scrolled down
  isScrolled.value = currentScrollPosition > 10

  // Auto-hide header on scroll down, show on scroll up
  if (currentScrollPosition < 0) {
    return
  }
  
  // Don't hide header for small scrolls
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 50) {
    return
  }

  showHeader.value = currentScrollPosition < lastScrollPosition.value || currentScrollPosition < 50
  lastScrollPosition.value = currentScrollPosition
}

// Check if link is active
const isActiveRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Close menu on route change
watch(() => route.path, () => {
  closeMenu()
})
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4',
      showHeader ? 'translate-y-0' : '-translate-y-full'
    ]"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex flex-shrink-0 items-center">
          <router-link 
            to="/" 
            class="text-2xl font-bold transition-all duration-300"
            :class="isScrolled && !isMenuOpen ? 'text-primary' : 'text-white'"
          >
            <span class="inline-flex items-baseline">
              <span class="text-primary align-baseline">B</span><span :class="isScrolled && !isMenuOpen ? 'text-gray-800 dark:text-gray-300' : 'text-white'">oxing Academy</span>
            </span>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:ml-6 md:flex md:items-center md:space-x-8">
          <router-link
            to="/"
            class="relative text-sm font-medium transition-colors duration-300 hover:text-primary focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="Home"
          >
            <span>Home</span>
            <span 
              class="absolute bottom-0 left-0 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left"
              :class="{ 'scale-x-100': isActiveRoute('/') }"
            ></span>
          </router-link>
          <router-link
            to="/courses"
            class="relative text-sm font-medium transition-colors duration-300 hover:text-primary focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="Courses"
          >
            <span>Courses</span>
            <span 
              class="absolute bottom-0 left-0 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left"
              :class="{ 'scale-x-100': isActiveRoute('/courses') }"
            ></span>
          </router-link>
          <router-link
            to="/about"
            class="relative text-sm font-medium transition-colors duration-300 hover:text-primary focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="About"
          >
            <span>About</span>
            <span 
              class="absolute bottom-0 left-0 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left"
              :class="{ 'scale-x-100': isActiveRoute('/about') }"
            ></span>
          </router-link>
          <router-link
            to="/contact"
            class="relative text-sm font-medium transition-colors duration-300 hover:text-primary focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="Contact"
          >
            <span>Contact</span>
            <span 
              class="absolute bottom-0 left-0 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left"
              :class="{ 'scale-x-100': isActiveRoute('/contact') }"
            ></span>
          </router-link>
        </nav>
        
        <!-- Desktop Action Buttons -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <router-link 
            to="/cart" 
            class="relative rounded-full p-2 transition-colors hover:bg-white/10 focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="Shopping Cart"
          >
            <ShoppingCartIcon class="h-6 w-6" />
            <span 
              v-if="cartCount > 0" 
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
            >
              {{ cartCount }}
            </span>
          </router-link>
          
          <router-link
            :to="isLoggedIn ? '/account' : '/auth'"
            class="group relative rounded-full p-2 transition-colors hover:bg-white/10 focus-ring"
            :class="isScrolled ? 'text-gray-800 dark:text-gray-300' : 'text-white'"
            aria-label="User Account"
          >
            <UserIcon class="h-6 w-6" />
          </router-link>
        </div>
        
        <!-- Mobile Menu Button -->
        <div class="flex md:hidden">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            :class="isScrolled ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700' : 'text-white hover:bg-white/10'"
            aria-expanded="false"
          >
            <span class="sr-only">{{ isMenuOpen ? 'Close menu' : 'Open menu' }}</span>
            <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden glassmorphism animate-slide-in-bottom"
    >
      <div class="space-y-1 px-2 pb-3 pt-2">
        <button
          @click="navigateTo('/')"
          class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
        >
          Home
        </button>
        <button
          @click="navigateTo('/courses')"
          class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
        >
          Courses
        </button>
        <button
          @click="navigateTo('/about')"
          class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
        >
          About
        </button>
        <button
          @click="navigateTo('/contact')"
          class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
        >
          Contact
        </button>
      </div>
      <div class="border-t border-white/10 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <UserIcon class="h-6 w-6 text-white" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">
              {{ isLoggedIn ? 'My Account' : 'Sign In / Register' }}
            </div>
          </div>
          <div class="ml-auto">
            <router-link 
              to="/cart" 
              class="relative rounded-full p-1 text-white transition-colors hover:bg-white/10"
              aria-label="Shopping Cart"
            >
              <ShoppingCartIcon class="h-6 w-6" />
              <span 
                v-if="cartCount > 0" 
                class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <button
            @click="navigateTo(isLoggedIn ? '/account' : '/auth')"
            class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
          >
            {{ isLoggedIn ? 'My Account' : 'Sign In / Register' }}
          </button>
          <button
            v-if="isLoggedIn"
            @click="userStore.logout(); closeMenu()"
            class="block w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template> 