<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'rectangle',
    validator: (value: string) => ['rectangle', 'circle', 'text', 'product-card', 'avatar'].includes(value)
  },
  width: {
    type: String,
    default: 'full'
  },
  height: {
    type: String,
    default: 'auto'
  },
  rounded: {
    type: String,
    default: 'md'
  },
  animate: {
    type: Boolean,
    default: true
  },
  repeat: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <template v-if="type === 'product-card'">
    <div 
      v-for="i in repeat" 
      :key="i" 
      class="rounded-lg bg-white shadow-custom dark:bg-gray-800 h-full flex flex-col overflow-hidden"
    >
      <div class="aspect-video w-full bg-gray-200 dark:bg-gray-700"></div>
      <div class="p-5 flex flex-col flex-grow">
        <div class="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-1 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-4 flex items-center justify-between">
          <div class="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </template>
  
  <template v-else-if="type === 'avatar'">
    <div 
      v-for="i in repeat" 
      :key="i" 
      class="flex items-center space-x-3"
    >
      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div class="flex flex-col space-y-2">
        <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </template>
  
  <template v-else-if="type === 'text'">
    <div 
      v-for="i in repeat" 
      :key="i" 
      class="space-y-2"
    >
      <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </template>
  
  <div 
    v-else
    v-for="i in repeat" 
    :key="i" 
    :class="[
      'bg-gray-200 dark:bg-gray-700', 
      animate ? 'animate-pulse' : '',
      `rounded-${rounded}`,
      `w-${width}`,
      `h-${height}`,
      type === 'circle' ? 'rounded-full' : ''
    ]"
  >
  </div>
</template> 