<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({
  primary: {
    type: Boolean,
    default: false
  },
  secondary: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  }
})

const ripples = ref<{ id: number; x: number; y: number; size: number }[]>([])
let nextId = 0

const createRipple = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Calculate the size of the ripple
  const size = Math.max(rect.width, rect.height) * 2
  
  // Add the ripple
  const ripple = {
    id: nextId++,
    x,
    y,
    size
  }
  
  ripples.value.push(ripple)
  
  // Remove the ripple after animation
  setTimeout(() => {
    const index = ripples.value.findIndex(r => r.id === ripple.id)
    if (index !== -1) {
      ripples.value.splice(index, 1)
    }
  }, 1000)
}

// Calculate button classes based on props
const buttonClasses = computed(() => {
  const classes = [
    'relative overflow-hidden',
    'inline-flex items-center justify-center',
    'transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    fullWidth.value ? 'w-full' : '',
  ]
  
  // Add size classes
  switch (size.value) {
    case 'sm':
      classes.push('px-3 py-1.5 text-sm rounded-md')
      break
    case 'lg':
      classes.push('px-8 py-4 text-lg rounded-lg')
      break
    default: // md
      classes.push('px-6 py-3 text-base rounded-lg')
  }
  
  // Add style variants
  if (primary.value) {
    classes.push('bg-primary text-white hover:bg-primary-600 focus:ring-primary-300 shadow-md hover:shadow-lg transform hover:scale-102 active:scale-98')
  } else if (secondary.value) {
    classes.push('bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-300 shadow-md hover:shadow-lg transform hover:scale-102 active:scale-98')
  } else if (outline.value) {
    classes.push('border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md transform hover:scale-102 active:scale-98')
  } else if (icon.value) {
    classes.push('rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700')
  } else {
    classes.push('bg-white text-gray-800 hover:bg-gray-50 focus:ring-gray-300 shadow-md hover:shadow-lg transform hover:scale-102 active:scale-98')
  }
  
  // Disabled state
  if (disabled.value) {
    classes.push('opacity-50 cursor-not-allowed')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="createRipple"
    @mousedown="createRipple"
  >
    <!-- Ripple effects -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
      :style="{
        left: `${ripple.x - ripple.size / 2}px`,
        top: `${ripple.y - ripple.size / 2}px`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
      }"
    ></span>
    
    <!-- Button content -->
    <slot></slot>
  </button>
</template>

<style>
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 1s linear;
}
</style> 