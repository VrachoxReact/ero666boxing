<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { XMarkIcon, ShoppingBagIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const isLoading = ref(true)
const couponCode = ref('')
const isApplyingCoupon = ref(false)
const couponError = ref('')
const couponSuccess = ref('')

// Cart items with all details
const cartItems = computed(() => cartStore.items)

// Total number of items in cart
const itemCount = computed(() => cartStore.cartCount)

// Cart subtotal
const subtotal = computed(() => {
  return cartStore.subtotal
})

// Tax calculation (e.g., 10%)
const taxRate = 0.10
const taxAmount = computed(() => subtotal.value * taxRate)

// Total with tax
const total = computed(() => {
  let finalTotal = subtotal.value + taxAmount.value
  
  // Apply discount if exists
  if (cartStore.couponDiscount > 0) {
    finalTotal = finalTotal - (finalTotal * (cartStore.couponDiscount / 100))
  }
  
  return finalTotal
})

// Check if cart is empty
const isCartEmpty = computed(() => cartItems.value.length === 0)

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Remove item from cart
const removeItem = (itemId: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to remove this item from your cart?',
    'Remove Item',
    {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    cartStore.removeFromCart(itemId)
    ElMessage({
      type: 'success',
      message: 'Item removed from cart'
    })
  }).catch(() => {})
}

// Update item quantity
const updateQuantity = (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return
  cartStore.updateQuantity(itemId, newQuantity)
}

// Apply coupon code
const applyCoupon = () => {
  if (!couponCode.value) {
    couponError.value = 'Please enter a coupon code'
    return
  }
  
  isApplyingCoupon.value = true
  couponError.value = ''
  couponSuccess.value = ''
  
  // Simulate API call to validate coupon
  setTimeout(() => {
    isApplyingCoupon.value = false
    
    // Demo coupon codes
    if (couponCode.value.toUpperCase() === 'BOXING20') {
      cartStore.applyCoupon(couponCode.value)
      couponSuccess.value = 'Coupon applied: 20% off your order!'
    } else if (couponCode.value.toUpperCase() === 'WELCOME10') {
      cartStore.applyCoupon(couponCode.value)
      couponSuccess.value = 'Coupon applied: 10% off your order!'
    } else {
      couponError.value = 'Invalid coupon code'
    }
  }, 800)
}

// Clear cart confirmation
const confirmClearCart = () => {
  if (isCartEmpty.value) return
  
  ElMessageBox.confirm(
    'Are you sure you want to clear all items from your cart?',
    'Clear Cart',
    {
      confirmButtonText: 'Clear Cart',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    cartStore.clearCart()
    ElMessage({
      type: 'success',
      message: 'Cart cleared successfully'
    })
  }).catch(() => {})
}

// Proceed to checkout
const proceedToCheckout = () => {
  if (isCartEmpty.value) {
    ElMessage({
      type: 'warning',
      message: 'Your cart is empty'
    })
    return
  }
  
  // Check if user is logged in
  if (!userStore.isAuthenticated) {
    ElMessageBox.confirm(
      'You need to sign in to proceed with checkout. Would you like to sign in now?',
      'Sign In Required',
      {
        confirmButtonText: 'Sign In',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(() => {
      // Store intended destination
      localStorage.setItem('redirectAfterLogin', '/checkout')
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  // If user is authenticated, proceed to checkout
  router.push('/checkout')
}

// Continue shopping
const continueShopping = () => {
  router.push('/courses')
}

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 400)
})
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Shopping Cart</h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Review your items before proceeding to checkout
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse-light space-y-8">
        <div class="h-12 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      
      <!-- Empty Cart State -->
      <div 
        v-else-if="isCartEmpty" 
        class="mx-auto flex max-w-md flex-col items-center justify-center rounded-lg bg-white px-6 py-16 text-center shadow-sm dark:bg-gray-800"
      >
        <ShoppingBagIcon class="h-16 w-16 text-gray-400" />
        <h2 class="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Looks like you haven't added any courses to your cart yet.
        </p>
        <button 
          @click="continueShopping" 
          class="btn btn-primary mt-8"
        >
          Browse Courses
        </button>
      </div>
      
      <!-- Cart Content -->
      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-8">
          <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Cart Items ({{ itemCount }})
                </h2>
                <button 
                  @click="confirmClearCart" 
                  class="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  Clear Cart
                </button>
              </div>
              
              <!-- Item List -->
              <div class="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex py-6 sm:py-8"
                >
                  <!-- Course Image -->
                  <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img 
                      :src="item.image" 
                      :alt="item.title" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  
                  <!-- Item Details -->
                  <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div class="flex justify-between">
                        <h3 class="text-base font-medium text-gray-900 dark:text-white">
                          {{ item.title }}
                        </h3>
                        <p class="ml-4 text-base font-medium text-gray-900 dark:text-white">
                          {{ formatCurrency(item.price * item.quantity) }}
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {{ item.category }} • {{ item.level }}
                      </p>
                    </div>
                    
                    <div class="mt-4 flex flex-1 items-end justify-between">
                      <div class="flex items-center border border-gray-200 rounded dark:border-gray-600">
                        <button 
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          class="flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-400"
                          :disabled="item.quantity <= 1"
                          :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
                        >
                          -
                        </button>
                        <span class="flex h-8 min-w-[2rem] items-center justify-center px-2 text-gray-900 dark:text-white">
                          {{ item.quantity }}
                        </span>
                        <button 
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          class="flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-400"
                        >
                          +
                        </button>
                      </div>
                      <div class="flex">
                        <button 
                          type="button" 
                          @click="removeItem(item.id)" 
                          class="flex items-center text-sm font-medium text-red-500 hover:text-red-600"
                        >
                          <XMarkIcon class="mr-1 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Continue Shopping -->
          <div class="mt-8">
            <button 
              @click="continueShopping" 
              class="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ArrowPathIcon class="mr-2 h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="mt-8 lg:col-span-4 lg:mt-0">
          <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div class="p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h2>
              
              <!-- Coupon Code -->
              <div class="mt-6">
                <label 
                  for="coupon" 
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Discount Code
                </label>
                <div class="mt-1 flex space-x-4">
                  <input
                    id="coupon"
                    v-model="couponCode"
                    type="text"
                    class="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Enter code"
                  />
                  <button
                    @click="applyCoupon"
                    class="btn-outline btn-sm btn"
                    :disabled="isApplyingCoupon"
                  >
                    <ArrowPathIcon v-if="isApplyingCoupon" class="mr-2 h-4 w-4 animate-spin" />
                    Apply
                  </button>
                </div>
                <p v-if="couponError" class="mt-2 text-sm text-red-500">{{ couponError }}</p>
                <p v-if="couponSuccess" class="mt-2 text-sm text-green-500">{{ couponSuccess }}</p>
              </div>
              
              <!-- Price Breakdown -->
              <div class="mt-6 space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(subtotal) }}
                  </p>
                </div>
                
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Tax (10%)</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(taxAmount) }}
                  </p>
                </div>
                
                <div v-if="cartStore.couponDiscount > 0" class="flex items-center justify-between">
                  <p class="text-sm text-green-600 dark:text-green-400">Discount ({{ cartStore.couponDiscount }}%)</p>
                  <p class="text-sm font-medium text-green-600 dark:text-green-400">
                    -{{ formatCurrency((subtotal + taxAmount) * (cartStore.couponDiscount / 100)) }}
                  </p>
                </div>
                
                <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <p class="text-base font-medium text-gray-900 dark:text-white">Order Total</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(total) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Checkout Button -->
              <div class="mt-6">
                <button
                  @click="proceedToCheckout"
                  class="btn btn-primary w-full"
                  :disabled="isCartEmpty"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <!-- Payment Methods -->
              <div class="mt-4 flex justify-center space-x-2">
                <img src="/images/payment/visa.svg" alt="Visa" class="h-8" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" class="h-8" />
                <img src="/images/payment/amex.svg" alt="American Express" class="h-8" />
                <img src="/images/payment/paypal.svg" alt="PayPal" class="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 