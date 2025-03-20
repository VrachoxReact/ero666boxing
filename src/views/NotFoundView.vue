<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
    <div class="mx-auto max-w-lg px-4 text-center">
      <div class="mb-8 text-primary">
        <svg class="mx-auto h-40 w-40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <h2 class="mb-6 text-2xl font-medium text-gray-900 dark:text-white">Page Not Found</h2>
      
      <p class="mb-8 text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex flex-col justify-center gap-4 sm:flex-row">
        <button @click="goBack" class="btn btn-outline">
          Go Back
        </button>
        <button @click="goHome" class="btn btn-primary">
          Return to Homepage
        </button>
      </div>
      
      <div class="mt-12">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Need help? <a href="/contact" class="text-primary hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  </div>
</template> 