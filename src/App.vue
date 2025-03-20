<script setup lang="ts">
import { onMounted } from 'vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import { useCartStore } from './stores/cartStore'
import { useUserStore } from './stores/userStore'

const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(() => {
  // Check authentication status
  userStore.checkAuth()
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition
          name="page"
          mode="out-in"
          appear
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
