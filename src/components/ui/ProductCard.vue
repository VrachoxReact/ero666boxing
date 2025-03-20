<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { ShoppingCartIcon, StarIcon } from '@heroicons/vue/24/solid'
import { EyeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showRating: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const isHovered = ref(false)

const navigateToProduct = () => {
  router.push({ name: 'course-detail', params: { id: props.product.id } })
}

const addToCart = (event: Event) => {
  event.stopPropagation()
  cartStore.addToCart(props.product)
}

const formatPrice = (price: number) => {
  return price.toFixed(2)
}
</script>

<template>
  <div 
    class="group relative rounded-lg bg-white shadow-custom dark:bg-gray-800 h-full flex flex-col overflow-hidden transition-all duration-500"
    :class="{ 'shadow-custom-lg': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="navigateToProduct"
  >
    <!-- Image Container -->
    <div class="relative aspect-video w-full overflow-hidden">
      <img 
        :src="product.image" 
        :alt="product.title" 
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      <!-- Overlay with gradient -->
      <div 
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-80"
      ></div>
      
      <!-- Tags/Badges -->
      <div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <span 
          class="badge bg-primary/90 text-white backdrop-blur-sm group-hover:bg-primary transition-colors duration-300"
        >
          {{ product.category }}
        </span>
        <span 
          v-if="product.level" 
          class="badge bg-white/80 text-gray-800 backdrop-blur-sm transition-colors duration-300"
        >
          {{ product.level }}
        </span>
      </div>
      
      <!-- Quick Action Buttons -->
      <div class="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <button 
          @click.stop="navigateToProduct"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-all duration-300 hover:bg-primary hover:text-white backdrop-blur-sm"
          aria-label="View details"
        >
          <EyeIcon class="h-4 w-4" />
        </button>
        <button 
          @click.stop="addToCart($event)"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-all duration-300 hover:bg-primary hover:text-white backdrop-blur-sm"
          aria-label="Add to cart"
        >
          <ShoppingCartIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="flex flex-col flex-grow p-5">
      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
        {{ product.title }}
      </h3>
      
      <!-- Ratings -->
      <div v-if="showRating && product.rating" class="mt-2 flex items-center">
        <div class="flex">
          <StarIcon 
            v-for="i in 5" 
            :key="i" 
            :class="[
              'h-4 w-4', 
              i <= product.rating ? 'text-yellow-400' : 'text-gray-300'
            ]" 
          />
        </div>
        <span class="ml-2 text-xs text-gray-500">
          {{ product.reviews || 0 }} reviews
        </span>
      </div>
      
      <!-- Description -->
      <p class="mt-2 flex-grow text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {{ product.shortDescription }}
      </p>
      
      <!-- Price and Action -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            ${{ formatPrice(product.price) }}
          </span>
          <span 
            v-if="product.discountPrice" 
            class="ml-2 text-sm text-gray-500 line-through dark:text-gray-400"
          >
            ${{ formatPrice(product.discountPrice) }}
          </span>
        </div>
        
        <button 
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          @click.stop="addToCart($event)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template> 