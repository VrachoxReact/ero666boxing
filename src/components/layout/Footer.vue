<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const email = ref('')
const isSubscribing = ref(false)

const currentYear = new Date().getFullYear()

const links = {
  courses: [
    { name: 'All Courses', to: '/courses' },
    { name: 'Beginner Courses', to: '/courses?level=Beginner' },
    { name: 'Intermediate Courses', to: '/courses?level=Intermediate' },
    { name: 'Advanced Courses', to: '/courses?level=Advanced' }
  ],
  info: [
    { name: 'About Us', to: '/about' },
    { name: 'Contact', to: '/contact' },
    { name: 'FAQ', to: '/contact#faq' },
    { name: 'Terms of Service', to: '/terms' },
    { name: 'Privacy Policy', to: '/privacy' }
  ],
  account: [
    { name: 'Sign In', to: '/auth?tab=login' },
    { name: 'Register', to: '/auth?tab=register' },
    { name: 'My Account', to: '/account' },
    { name: 'My Courses', to: '/account?tab=courses' },
    { name: 'Cart', to: '/cart' }
  ]
}

// Handle newsletter subscription
const subscribeToNewsletter = () => {
  if (!email.value) {
    ElMessage({
      message: 'Please enter a valid email address',
      type: 'error'
    })
    return
  }
  
  isSubscribing.value = true
  
  // Simulate API call
  setTimeout(() => {
    isSubscribing.value = false
    ElMessage({
      message: 'Thank you for subscribing to our newsletter!',
      type: 'success'
    })
    email.value = ''
  }, 1000)
}
</script>

<template>
  <footer class="relative bg-gray-900 text-white">
    <!-- Decorative wave -->
    <div class="absolute -top-16 left-0 right-0 h-16 overflow-hidden">
      <div class="absolute top-0 left-0 right-0">
        <svg class="w-full h-16" viewBox="0 0 1440 48" preserveAspectRatio="none" transform="rotate(180)">
          <path fill="white" d="M0,48 L1440,48 L1440,0 C1139.02,20 857.045,30 576.032,30 C295.019,30 124.502,20 0,0 L0,48 Z"></path>
        </svg>
      </div>
    </div>
    
    <div class="pt-20 pb-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top section with links -->
        <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <!-- Logo and About -->
          <div class="animate-on-scroll opacity-0">
            <div class="text-2xl font-bold text-white inline-flex items-baseline">
              <span class="text-primary align-baseline">B</span><span class="text-white">oxing Academy</span>
            </div>
            <p class="mt-5 text-gray-400">
              Learn boxing from Croatia's 8-time national champion with expert-led online courses for all skill levels.
            </p>
            <div class="mt-8 flex space-x-4">
              <a href="#" class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-white" aria-label="Facebook">
                <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-white" aria-label="Instagram">
                <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-white" aria-label="YouTube">
                <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Courses Links -->
          <div class="animate-on-scroll opacity-0">
            <h3 class="text-lg font-semibold text-white section-heading">Courses</h3>
            <ul class="mt-6 space-y-3">
              <li v-for="(link, index) in links.courses" :key="index">
                <router-link
                  :to="link.to"
                  class="text-gray-400 transition-all duration-300 hover:text-white hover:translate-x-1 inline-flex items-center group"
                >
                  <span>{{ link.name }}</span>
                  <ArrowRightIcon class="ml-1 h-3 w-0 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100" />
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- Info Links -->
          <div class="animate-on-scroll opacity-0">
            <h3 class="text-lg font-semibold text-white section-heading">Information</h3>
            <ul class="mt-6 space-y-3">
              <li v-for="(link, index) in links.info" :key="index">
                <router-link
                  :to="link.to"
                  class="text-gray-400 transition-all duration-300 hover:text-white hover:translate-x-1 inline-flex items-center group"
                >
                  <span>{{ link.name }}</span>
                  <ArrowRightIcon class="ml-1 h-3 w-0 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100" />
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- Newsletter -->
          <div class="animate-on-scroll opacity-0">
            <h3 class="text-lg font-semibold text-white section-heading">Subscribe to Newsletter</h3>
            <p class="mt-6 text-gray-400">
              Get the latest news, updates and exclusive offers directly to your inbox.
            </p>
            <form @submit.prevent="subscribeToNewsletter" class="mt-6">
              <div class="flex max-w-md rounded-lg overflow-hidden border border-white/10 focus-within:border-primary/50 transition-all duration-300">
                <div class="flex-grow relative">
                  <input
                    v-model="email"
                    type="email"
                    required
                    placeholder="Your email address"
                    class="w-full border-0 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
                  />
                  <EnvelopeIcon class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  type="submit"
                  class="bg-primary px-5 text-white hover:bg-primary-600 focus:outline-none transition-colors duration-300 flex items-center justify-center"
                  :disabled="isSubscribing"
                >
                  <span v-if="isSubscribing" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Subscribe</span>
                </button>
              </div>
              <p class="mt-3 text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
        
        <!-- Bottom section with copyright and additional links -->
        <div class="mt-12 border-t border-gray-800 pt-8 pb-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center">
            <p class="text-sm text-gray-400">
              &copy; {{ currentYear }} Boxing Academy. All rights reserved.
            </p>
            <div class="mt-4 md:mt-0 flex space-x-6">
              <router-link to="/privacy" class="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </router-link>
              <router-link to="/terms" class="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </router-link>
              <router-link to="/contact" class="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Contact Us
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template> 