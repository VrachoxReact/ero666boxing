import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Define cart item type
export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const couponCode = ref<string | null>(null)
  const couponDiscount = ref<number>(0)
  
  // Initialize cart from localStorage
  const initCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        items.value = parsedCart
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error)
        items.value = []
      }
    }
  }
  
  // Call initialization
  initCart()
  
  // Save cart to localStorage whenever it changes
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  // Getters
  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
  
  const discount = computed(() => {
    return couponDiscount.value > 0 ? subtotal.value * (couponDiscount.value / 100) : 0
  })
  
  const taxRate = 0.085 // 8.5% tax rate
  
  const tax = computed(() => {
    return (subtotal.value - discount.value) * taxRate
  })
  
  const total = computed(() => {
    return subtotal.value - discount.value + tax.value
  })
  
  const isEmpty = computed(() => {
    return items.value.length === 0
  })
  
  // Actions
  /**
   * Add item to cart
   */
  function addToCart(item: Omit<CartItem, 'quantity'>) {
    isLoading.value = true
    
    try {
      const existingItemIndex = items.value.findIndex(cartItem => cartItem.id === item.id)
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        items.value[existingItemIndex].quantity += 1
      } else {
        // Item doesn't exist, add to cart
        items.value.push({
          ...item,
          quantity: 1
        })
      }
      
      saveCart()
      
      ElMessage({
        message: 'Item added to cart',
        type: 'success',
      })
    } catch (error) {
      console.error('Error adding item to cart:', error)
      
      ElMessage({
        message: 'Failed to add item to cart',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Remove item from cart
   */
  function removeFromCart(itemId: number) {
    isLoading.value = true
    
    try {
      items.value = items.value.filter(item => item.id !== itemId)
      saveCart()
      
      ElMessage({
        message: 'Item removed from cart',
        type: 'success',
      })
    } catch (error) {
      console.error('Error removing item from cart:', error)
      
      ElMessage({
        message: 'Failed to remove item from cart',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Update item quantity
   */
  function updateQuantity(itemId: number, quantity: number) {
    isLoading.value = true
    
    try {
      const itemIndex = items.value.findIndex(item => item.id === itemId)
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          items.value = items.value.filter(item => item.id !== itemId)
        } else {
          // Update quantity
          items.value[itemIndex].quantity = quantity
        }
        
        saveCart()
      }
    } catch (error) {
      console.error('Error updating item quantity:', error)
      
      ElMessage({
        message: 'Failed to update item quantity',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Clear cart
   */
  function clearCart() {
    isLoading.value = true
    
    try {
      items.value = []
      couponCode.value = null
      couponDiscount.value = 0
      saveCart()
      
      ElMessage({
        message: 'Cart cleared',
        type: 'success',
      })
    } catch (error) {
      console.error('Error clearing cart:', error)
      
      ElMessage({
        message: 'Failed to clear cart',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Apply coupon code
   */
  function applyCoupon(code: string) {
    isLoading.value = true
    
    try {
      // Mock coupon codes
      const validCoupons = {
        'WELCOME10': 10,
        'SUMMER20': 20,
        'BOXING30': 30
      }
      
      const enteredCode = code.toUpperCase()
      
      if (enteredCode in validCoupons) {
        couponCode.value = enteredCode
        couponDiscount.value = validCoupons[enteredCode as keyof typeof validCoupons]
        
        ElMessage({
          message: `Coupon applied: ${couponDiscount.value}% discount`,
          type: 'success',
        })
        
        return true
      } else {
        ElMessage({
          message: 'Invalid coupon code',
          type: 'error',
        })
        
        return false
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      
      ElMessage({
        message: 'Failed to apply coupon',
        type: 'error',
      })
      
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Remove coupon
   */
  function removeCoupon() {
    couponCode.value = null
    couponDiscount.value = 0
    
    ElMessage({
      message: 'Coupon removed',
      type: 'success',
    })
  }
  
  return {
    items,
    isLoading,
    couponCode,
    couponDiscount,
    cartCount,
    subtotal,
    discount,
    tax,
    total,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  }
}) 