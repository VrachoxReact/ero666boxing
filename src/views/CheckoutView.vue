<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { LockClosedIcon, CreditCardIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ElMessage, ElStep, ElSteps, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadio, ElRadioGroup, ElCheckbox, ElButton } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const isLoading = ref(true)
const currentStep = ref(1)
const isProcessing = ref(false)
const agreeToTerms = ref(false)
const orderComplete = ref(false)
const orderId = ref('')

// Form data
const billingForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
})

const paymentForm = reactive({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  paymentMethod: 'credit-card',
})

// Validation states
const billingFormValid = ref(false)
const paymentFormValid = ref(false)

// Cart items with all details
const cartItems = computed(() => cartStore.items)

// Check if cart is empty
const isCartEmpty = computed(() => cartItems.value.length === 0)

// Cart totals
const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const taxRate = 0.10
const taxAmount = computed(() => subtotal.value * taxRate)

const discountAmount = computed(() => {
  if (cartStore.couponDiscount > 0) {
    return (subtotal.value + taxAmount.value) * (cartStore.couponDiscount / 100)
  }
  return 0
})

const total = computed(() => {
  return subtotal.value + taxAmount.value - discountAmount.value
})

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Country options
const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
]

// Step navigation
const goToStep = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  } else if (step === 2 && billingFormValid.value) {
    currentStep.value = 2
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.push('/cart')
  }
}

const goToNextStep = () => {
  if (currentStep.value === 1) {
    validateBillingForm()
    if (billingFormValid.value) {
      currentStep.value = 2
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (currentStep.value === 2) {
    validatePaymentForm()
    if (paymentFormValid.value) {
      placeOrder()
    }
  }
}

// Form validation
const validateBillingForm = () => {
  billingFormValid.value = true
  
  // Very simple validation for demo purposes
  if (!billingForm.firstName || 
      !billingForm.lastName || 
      !billingForm.email || 
      !billingForm.phone || 
      !billingForm.address || 
      !billingForm.city || 
      !billingForm.state || 
      !billingForm.zipCode) {
    
    billingFormValid.value = false
    ElMessage({
      message: 'Please fill in all required fields',
      type: 'error'
    })
  }
}

const validatePaymentForm = () => {
  paymentFormValid.value = true
  
  // Simple validation
  if (paymentForm.paymentMethod === 'credit-card') {
    if (!paymentForm.cardNumber || 
        !paymentForm.cardName || 
        !paymentForm.expiryDate || 
        !paymentForm.cvv) {
      
      paymentFormValid.value = false
      ElMessage({
        message: 'Please fill in all payment details',
        type: 'error'
      })
    }
  }
  
  if (!agreeToTerms.value) {
    paymentFormValid.value = false
    ElMessage({
      message: 'Please agree to the terms and conditions',
      type: 'error'
    })
  }
}

// Place order
const placeOrder = () => {
  if (isCartEmpty.value) {
    router.push('/courses')
    return
  }
  
  isProcessing.value = true
  
  // Simulate order processing
  setTimeout(() => {
    // Generate random order ID
    orderId.value = 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Show success notification
    ElMessage({
      message: 'Order placed successfully!',
      type: 'success',
    })
    
    // Clear cart
    cartStore.clearCart()
    
    // Set order as complete
    orderComplete.value = true
    isProcessing.value = false
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 2000)
}

// Back to courses
const backToCourses = () => {
  router.push('/courses')
}

// Pre-fill form with user data if available
onMounted(() => {
  // Redirect if not authenticated
  if (!userStore.isAuthenticated) {
    router.push('/login')
    localStorage.setItem('redirectAfterLogin', '/checkout')
    return
  }
  
  // Redirect if cart is empty
  if (isCartEmpty.value) {
    router.push('/courses')
    ElMessage({
      message: 'Your cart is empty',
      type: 'info',
    })
    return
  }
  
  // Pre-fill form with user data
  if (userStore.user) {
    const user = userStore.user
    billingForm.firstName = user.firstName || ''
    billingForm.lastName = user.lastName || ''
    billingForm.email = user.email || ''
    billingForm.phone = user.phone || ''
  }
  
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="bg-gray-50 py-16 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse-light space-y-8">
        <div class="h-12 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      
      <!-- Order Complete -->
      <div v-else-if="orderComplete" class="mx-auto max-w-3xl">
        <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <div class="mb-8 text-center">
            <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheckIcon class="h-12 w-12 text-primary" />
            </div>
            <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Order Complete!</h1>
            <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Thank you for your purchase.
            </p>
          </div>
          
          <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            <div class="mt-4 space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Order ID:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ orderId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Date:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ new Date().toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(total) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ paymentForm.paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <p class="mb-4 text-gray-600 dark:text-gray-400">
              An email with your order details has been sent to {{ billingForm.email }}.
            </p>
            <button @click="backToCourses" class="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      
      <!-- Checkout Process -->
      <div v-else class="mx-auto max-w-7xl">
        <div class="mb-8 flex items-center">
          <button @click="goBack" class="mr-4 flex items-center text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <ArrowLeftIcon class="mr-1 h-4 w-4" />
            Back
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        </div>
        
        <!-- Checkout Steps -->
        <ElSteps :active="currentStep - 1" finish-status="success" class="mb-8">
          <ElStep title="Billing Information" @click="goToStep(1)" />
          <ElStep title="Payment" @click="goToStep(2)" />
        </ElSteps>
        
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <!-- Form Section -->
          <div class="lg:col-span-7">
            <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
              <!-- Billing Information Step -->
              <div v-if="currentStep === 1" class="p-6">
                <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Billing Information</h2>
                
                <ElForm :model="billingForm" label-position="top">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <ElFormItem label="First Name" required>
                      <ElInput v-model="billingForm.firstName" placeholder="First Name" />
                    </ElFormItem>
                    
                    <ElFormItem label="Last Name" required>
                      <ElInput v-model="billingForm.lastName" placeholder="Last Name" />
                    </ElFormItem>
                    
                    <ElFormItem label="Email" required>
                      <ElInput v-model="billingForm.email" placeholder="Email" type="email" />
                    </ElFormItem>
                    
                    <ElFormItem label="Phone" required>
                      <ElInput v-model="billingForm.phone" placeholder="Phone" />
                    </ElFormItem>
                    
                    <ElFormItem label="Address" required class="sm:col-span-2">
                      <ElInput v-model="billingForm.address" placeholder="Street Address" />
                    </ElFormItem>
                    
                    <ElFormItem label="City" required>
                      <ElInput v-model="billingForm.city" placeholder="City" />
                    </ElFormItem>
                    
                    <ElFormItem label="State/Province" required>
                      <ElInput v-model="billingForm.state" placeholder="State/Province" />
                    </ElFormItem>
                    
                    <ElFormItem label="ZIP/Postal Code" required>
                      <ElInput v-model="billingForm.zipCode" placeholder="ZIP/Postal Code" />
                    </ElFormItem>
                    
                    <ElFormItem label="Country" required>
                      <ElSelect v-model="billingForm.country" placeholder="Select Country" class="w-full">
                        <ElOption
                          v-for="country in countries"
                          :key="country.value"
                          :label="country.label"
                          :value="country.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </div>
                </ElForm>
                
                <div class="mt-8">
                  <button 
                    @click="goToNextStep" 
                    class="btn btn-primary w-full"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
              
              <!-- Payment Step -->
              <div v-if="currentStep === 2" class="p-6">
                <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                
                <ElRadioGroup v-model="paymentForm.paymentMethod" class="space-y-4">
                  <div 
                    class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    :class="{ 'border-primary bg-primary/5 dark:border-primary': paymentForm.paymentMethod === 'credit-card' }"
                  >
                    <ElRadio value="credit-card">
                      <div class="ml-2 flex items-center">
                        <CreditCardIcon class="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span class="font-medium">Credit Card</span>
                      </div>
                    </ElRadio>
                    
                    <div v-if="paymentForm.paymentMethod === 'credit-card'" class="mt-4 space-y-4">
                      <ElForm :model="paymentForm" label-position="top">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <ElFormItem label="Card Number" required class="sm:col-span-2">
                            <ElInput 
                              v-model="paymentForm.cardNumber" 
                              placeholder="1234 5678 9012 3456"
                              maxlength="19"
                            />
                          </ElFormItem>
                          
                          <ElFormItem label="Name on Card" required class="sm:col-span-2">
                            <ElInput v-model="paymentForm.cardName" placeholder="Name on Card" />
                          </ElFormItem>
                          
                          <ElFormItem label="Expiry Date (MM/YY)" required>
                            <ElInput 
                              v-model="paymentForm.expiryDate" 
                              placeholder="MM/YY"
                              maxlength="5"
                            />
                          </ElFormItem>
                          
                          <ElFormItem label="Security Code (CVV)" required>
                            <ElInput 
                              v-model="paymentForm.cvv" 
                              placeholder="CVV"
                              maxlength="4"
                              type="password"
                            />
                          </ElFormItem>
                        </div>
                      </ElForm>
                      
                      <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <LockClosedIcon class="h-4 w-4" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    :class="{ 'border-primary bg-primary/5 dark:border-primary': paymentForm.paymentMethod === 'paypal' }"
                  >
                    <ElRadio value="paypal">
                      <div class="ml-2 flex items-center">
                        <img src="/images/payment/paypal.svg" alt="PayPal" class="mr-2 h-5" />
                        <span class="font-medium">PayPal</span>
                      </div>
                    </ElRadio>
                    
                    <div v-if="paymentForm.paymentMethod === 'paypal'" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      You will be redirected to PayPal to complete your payment.
                    </div>
                  </div>
                </ElRadioGroup>
                
                <div class="mt-8 space-y-4">
                  <div class="flex items-start">
                    <ElCheckbox v-model="agreeToTerms" />
                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      I agree to the 
                      <a href="#" class="text-primary hover:underline">Terms of Service</a>
                      and
                      <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                    </span>
                  </div>
                  
                  <button 
                    @click="goToNextStep" 
                    class="btn btn-primary w-full"
                    :disabled="isProcessing"
                  >
                    <LockClosedIcon v-if="!isProcessing" class="mr-2 h-4 w-4" />
                    <span v-if="isProcessing" class="loading loading-spinner loading-sm mr-2"></span>
                    {{ isProcessing ? 'Processing...' : 'Place Order' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="mt-8 lg:col-span-5 lg:mt-0">
            <div class="sticky top-24 rounded-lg bg-white shadow-sm dark:bg-gray-800">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>
                
                <div class="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
                  <div v-for="item in cartItems" :key="item.id" class="flex py-4">
                    <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      <img 
                        :src="item.image" 
                        :alt="item.title" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between">
                          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ item.title }}
                          </h3>
                          <p class="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                            {{ formatCurrency(item.price * item.quantity) }}
                          </p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {{ item.category }} • {{ item.level }}
                        </p>
                      </div>
                      <div class="flex flex-1 items-end justify-between">
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Qty {{ item.quantity }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 space-y-4">
                  <div class="flex justify-between">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(subtotal) }}
                    </p>
                  </div>
                  
                  <div class="flex justify-between">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Tax (10%)</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(taxAmount) }}
                    </p>
                  </div>
                  
                  <div v-if="cartStore.couponDiscount > 0" class="flex justify-between">
                    <p class="text-sm text-green-600 dark:text-green-400">
                      Discount ({{ cartStore.couponDiscount }}%)
                    </p>
                    <p class="text-sm font-medium text-green-600 dark:text-green-400">
                      -{{ formatCurrency(discountAmount) }}
                    </p>
                  </div>
                </div>
                
                <div class="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div class="flex justify-between">
                    <p class="text-base font-medium text-gray-900 dark:text-white">Total</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(total) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="border-t border-gray-200 p-6 dark:border-gray-700">
                <div class="flex items-center">
                  <InformationCircleIcon class="h-5 w-5 text-gray-400" />
                  <p class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    Courses will be available in your account immediately after purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 