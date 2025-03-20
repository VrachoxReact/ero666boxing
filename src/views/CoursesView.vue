<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'
import { useCartStore } from '../stores/cartStore'
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon, FunnelIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { ElCheckbox, ElCollapse, ElCollapseItem, ElRadioGroup, ElRadio, ElSlider, ElMessage } from 'element-plus'
import type { Course } from '../stores/courseStore'
import ProductCard from '../components/ui/ProductCard.vue'
import SkeletonLoader from '../components/ui/SkeletonLoader.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const cartStore = useCartStore()

// States
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const selectedLevel = ref<string | null>(null)
const priceRange = ref([0, 150])
const sortBy = ref('popularity')
const isLoading = ref(true)
const isMobileFiltersOpen = ref<string[]>([])
const activeFilters = ref<string[]>([])
const currentPage = ref(1)
const coursesPerPage = ref(9)

// Get all courses
const allCourses = computed(() => courseStore.allCourses)

// Filter and sort courses
const filteredCourses = computed(() => {
  console.log('AllCourses value:', allCourses.value); // Debug log
  
  if (!allCourses.value || allCourses.value.length === 0) {
    console.log('No courses available'); // Debug log
    return []
  }
  
  let result = [...allCourses.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.description.toLowerCase().includes(query)
    )
  }
  
  // Category filter
  if (selectedCategory.value) {
    result = result.filter(course => course.category === selectedCategory.value)
  }
  
  // Level filter
  if (selectedLevel.value) {
    result = result.filter(course => course.level === selectedLevel.value)
  }
  
  // Price range filter
  result = result.filter(course => {
    const price = course.discountPrice ?? course.price
    return price >= priceRange.value[0] && price <= priceRange.value[1]
  })
  
  // Sort courses
  if (sortBy.value === 'price-low') {
    result.sort((a, b) => {
      const priceA = a.discountPrice ?? a.price
      const priceB = b.discountPrice ?? b.price
      return priceA - priceB
    })
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => {
      const priceA = a.discountPrice ?? a.price
      const priceB = b.discountPrice ?? b.price
      return priceB - priceA
    })
  } else if (sortBy.value === 'newest') {
    // Check if createdAt exists before sorting
    if (result.length > 0 && result[0].createdAt) {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  } else {
    // Default: sort by rating instead of isPopular which may not exist
    result.sort((a, b) => b.rating - a.rating)
  }
  
  console.log('Filtered results:', result.length); // Debug log
  return result
})

// Category count
const categoryCount = computed(() => {
  const counts: Record<string, number> = {}
  
  if (allCourses.value) {
    allCourses.value.forEach(course => {
      if (!counts[course.category]) {
        counts[course.category] = 0
      }
      counts[course.category]++
    })
  }
  
  return counts
})

// Levels count
const levelCount = computed(() => {
  const counts: Record<string, number> = {}
  
  if (allCourses.value) {
    allCourses.value.forEach(course => {
      if (!counts[course.level]) {
        counts[course.level] = 0
      }
      counts[course.level]++
    })
  }
  
  return counts
})

// Apply URL query params
const applyQueryParams = () => {
  const query = route.query
  
  if (query.category) {
    selectedCategory.value = query.category as string
    activeFilters.value.push(`Category: ${selectedCategory.value}`)
  }
  
  if (query.level) {
    selectedLevel.value = query.level as string
    activeFilters.value.push(`Level: ${selectedLevel.value}`)
  }
  
  if (query.search) {
    searchQuery.value = query.search as string
    activeFilters.value.push(`Search: ${searchQuery.value}`)
  }
  
  if (query.sort) {
    sortBy.value = query.sort as string
  }
}

// Update URL with filters
const updateQueryParams = () => {
  const query: Record<string, string> = {}
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  
  if (selectedLevel.value) {
    query.level = selectedLevel.value
  }
  
  if (searchQuery.value) {
    query.search = searchQuery.value
  }
  
  if (sortBy.value !== 'popularity') {
    query.sort = sortBy.value
  }
  
  router.replace({ query })
}

// Navigate to course details
const navigateToCourse = (course: Course) => {
  router.push({ name: 'course-detail', params: { id: course.id } })
}

// Add to cart
const addToCart = (course: Course, event: Event) => {
  event.stopPropagation()
  cartStore.addToCart(course)
}

// Clear all filters
const clearFilters = () => {
  selectedCategory.value = null
  selectedLevel.value = null
  searchQuery.value = ''
  priceRange.value = [0, 150]
  sortBy.value = 'popularity'
  activeFilters.value = []
  isMobileFiltersOpen.value = []
  currentPage.value = 1
  
  router.replace({ query: {} })
}

// Remove specific filter
const removeFilter = (filter: string) => {
  if (filter.startsWith('Category:')) {
    selectedCategory.value = null
  } else if (filter.startsWith('Level:')) {
    selectedLevel.value = null
  } else if (filter.startsWith('Search:')) {
    searchQuery.value = ''
  }
  
  activeFilters.value = activeFilters.value.filter(f => f !== filter)
  updateQueryParams()
}

// Watch for changes in filters
watch([selectedCategory, selectedLevel, searchQuery, sortBy], () => {
  // Update active filters
  activeFilters.value = []
  
  if (selectedCategory.value) {
    activeFilters.value.push(`Category: ${selectedCategory.value}`)
  }
  
  if (selectedLevel.value) {
    activeFilters.value.push(`Level: ${selectedLevel.value}`)
  }
  
  if (searchQuery.value) {
    activeFilters.value.push(`Search: ${searchQuery.value}`)
  }
  
  updateQueryParams()
})

// Initialize component
onMounted(async () => {
  console.log('CoursesView mounted');
  isLoading.value = true;
  
  try {
    // Await the fetchCourses call to ensure it completes
    await courseStore.fetchCourses();
    console.log('Courses fetched:', courseStore.allCourses.length);
    
    // Apply URL query params
    applyQueryParams();
  } catch (error) {
    console.error('Error loading courses:', error);
    ElMessage.error('Failed to load courses. Please try again later.');
  } finally {
    // Simulate loading with shorter delay
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage.value)
})

// Get paginated courses
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage.value
  const end = start + coursesPerPage.value
  return filteredCourses.value.slice(start, end)
})

// Reset page when filters change
watch(filteredCourses, () => {
  currentPage.value = 1
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="relative bg-gray-900 py-20 sm:py-24 text-white overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://placehold.co/1920x1080.webp?text=Boxing+Courses" 
          alt="Boxing Courses" 
          class="h-full w-full object-cover opacity-30 scale-105 transition-transform duration-10000 hover:scale-100"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/60"></div>
      </div>
      
      <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl animate-on-scroll opacity-0">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Explore Our <span class="text-primary-300 relative">Boxing Courses</span>
          </h1>
          <p class="mt-4 max-w-xl text-gray-300">
            Find the perfect boxing course tailored to your skill level, from beginners to advanced fighters.
            Learn from champion instructors and master the sweet science of boxing.
          </p>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute bottom-0 left-0 right-0 h-16">
        <svg class="absolute bottom-0 w-full h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1440 48">
          <path fill="currentColor" d="M0 48h1440V0c-395 39-836 39-1440 0v48z" />
        </svg>
      </div>
    </section>
    
    <!-- Search and Filters -->
    <section class="bg-white py-8 dark:bg-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <!-- Search -->
          <div class="flex flex-1 items-center">
            <div class="relative w-full max-w-lg">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full rounded-lg border-0 ring-1 ring-gray-300 pl-10 focus:border-primary focus:ring-2 focus:ring-primary shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Search courses..."
              />
            </div>
          </div>
          
          <!-- Sort and Filter buttons -->
          <div class="mt-4 flex items-center sm:mt-0">
            <!-- Sort Dropdown -->
            <div class="relative">
              <select
                v-model="sortBy"
                class="block rounded-lg border-0 ring-1 ring-gray-300 pr-10 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low">Sort by: Price (Low to High)</option>
                <option value="price-high">Sort by: Price (High to Low)</option>
                <option value="newest">Sort by: Newest</option>
              </select>
            </div>
            
            <!-- Mobile Filters Button -->
            <button
              @click="isMobileFiltersOpen = isMobileFiltersOpen.includes('filters') ? [] : ['filters']"
              class="ml-4 flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 sm:hidden"
            >
              <FunnelIcon class="h-5 w-5" />
              <span class="ml-2">Filters</span>
            </button>
          </div>
        </div>
        
        <!-- Active Filters -->
        <div v-if="activeFilters.length > 0" class="mt-4 flex flex-wrap items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
          <div
            v-for="filter in activeFilters"
            :key="filter"
            class="flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm transition-colors duration-300 hover:bg-primary/20"
          >
            <span>{{ filter }}</span>
            <button
              @click="removeFilter(filter)"
              class="ml-2 rounded-full bg-white h-4 w-4 flex items-center justify-center text-primary hover:bg-gray-100"
              aria-label="Remove filter"
            >
              <XMarkIcon class="h-3 w-3" />
            </button>
          </div>
          <button
            @click="clearFilters"
            class="ml-2 text-sm text-primary hover:text-primary-600 dark:text-primary-400"
          >
            Clear all
          </button>
        </div>
      </div>
    </section>
    
    <!-- Main Content -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-4 lg:gap-8">
          <!-- Filters (Desktop) -->
          <div class="hidden lg:block">
            <div class="rounded-xl bg-white p-6 shadow-custom dark:bg-gray-800 hover-lift">
              <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white section-heading">Filters</h3>
                <button
                  @click="clearFilters"
                  class="mt-2 text-sm text-primary hover:text-primary-600 dark:text-primary-400 flex items-center"
                >
                  <XMarkIcon class="h-4 w-4 mr-1" />
                  Clear all
                </button>
              </div>
              
              <!-- Categories -->
              <div class="py-6 border-b border-gray-200 dark:border-gray-700">
                <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Categories</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      id="category-all"
                      v-model="selectedCategory"
                      :value="null"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-all" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-beginner"
                      v-model="selectedCategory"
                      value="Fundamentals"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-beginner" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Fundamentals
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.beginner }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-intermediate"
                      v-model="selectedCategory"
                      value="Technique"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-intermediate" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Technique
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.intermediate }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-professional"
                      v-model="selectedCategory"
                      value="Fitness"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-professional" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Fitness
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.professional }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-elite"
                      v-model="selectedCategory"
                      value="Defense"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-elite" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Defense
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.elite }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-techniques"
                      v-model="selectedCategory"
                      value="Strategy"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-techniques" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Strategy
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.techniques }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="category-tactics"
                      v-model="selectedCategory"
                      value="Self-Defense"
                      type="radio"
                      name="category"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="category-tactics" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Self-Defense
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.tactics }}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Level -->
              <div class="py-6 border-b border-gray-200 dark:border-gray-700">
                <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Level</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      id="level-all"
                      v-model="selectedLevel"
                      :value="null"
                      type="radio"
                      name="level"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="level-all" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      All Levels
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="level-beginner"
                      v-model="selectedLevel"
                      value="Beginner"
                      type="radio"
                      name="level"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="level-beginner" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Beginner
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.beginner }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="level-intermediate"
                      v-model="selectedLevel"
                      value="Intermediate"
                      type="radio"
                      name="level"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="level-intermediate" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Intermediate
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.intermediate }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="level-advanced"
                      v-model="selectedLevel"
                      value="Advanced"
                      type="radio"
                      name="level"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="level-advanced" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      Advanced
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.advanced }}</span>
                    </label>
                  </div>
                  <div class="flex items-center group">
                    <input
                      id="level-expert"
                      v-model="selectedLevel"
                      value="All Levels"
                      type="radio"
                      name="level"
                      class="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary-600"
                    />
                    <label for="level-expert" class="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary transition-colors duration-300">
                      All Levels
                      <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.expert }}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Price Range -->
              <div class="py-6">
                <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Price</h4>
                <div class="px-2">
                  <ElSlider
                    v-model="priceRange"
                    range
                    :min="0"
                    :max="150"
                    :step="10"
                    show-stops
                    :marks="{0: '$0', 50: '$50', 100: '$100', 150: '$150'}"
                  />
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${{ priceRange[0] }}</span>
                  </div>
                  <div class="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${{ priceRange[1] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Course List -->
          <div class="mt-8 lg:col-span-3 lg:mt-0">
            <!-- Mobile Filters -->
            <ElCollapse v-model="isMobileFiltersOpen" class="mb-6 lg:hidden">
              <ElCollapseItem name="filters" title="Filters">
                <!-- Filter Content goes here (mirror the desktop filters) -->
                <div class="rounded-lg bg-white p-4 dark:bg-gray-800 space-y-6">
                  <!-- Categories -->
                  <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Categories</h4>
                    <ElRadioGroup v-model="selectedCategory">
                      <div class="space-y-3">
                        <div class="flex items-center">
                          <ElRadio :value="null">
                            <span>All Categories</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Fundamentals">
                            <span>Fundamentals</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.beginner }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Technique">
                            <span>Technique</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.intermediate }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Fitness">
                            <span>Fitness</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.professional }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Defense">
                            <span>Defense</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.elite }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Strategy">
                            <span>Strategy</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.techniques }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Self-Defense">
                            <span>Self-Defense</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ categoryCount.tactics }}</span>
                          </ElRadio>
                        </div>
                      </div>
                    </ElRadioGroup>
                  </div>

                  <!-- Level -->
                  <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Level</h4>
                    <ElRadioGroup v-model="selectedLevel">
                      <div class="space-y-3">
                        <div class="flex items-center">
                          <ElRadio :value="null">
                            <span>All Levels</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Beginner">
                            <span>Beginner</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.beginner }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Intermediate">
                            <span>Intermediate</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.intermediate }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="Advanced">
                            <span>Advanced</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.advanced }}</span>
                          </ElRadio>
                        </div>
                        <div class="flex items-center">
                          <ElRadio value="All Levels">
                            <span>All Levels</span> <span class="ml-1 text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{{ levelCount.expert }}</span>
                          </ElRadio>
                        </div>
                      </div>
                    </ElRadioGroup>
                  </div>
                  
                  <!-- Price Range -->
                  <div>
                    <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Price</h4>
                    <div class="px-2">
                      <ElSlider
                        v-model="priceRange"
                        range
                        :min="0"
                        :max="150"
                        :step="10"
                        show-stops
                        :marks="{0: '$0', 50: '$50', 100: '$100', 150: '$150'}"
                      />
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                      <div class="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${{ priceRange[0] }}</span>
                      </div>
                      <div class="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${{ priceRange[1] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ElCollapseItem>
            </ElCollapse>

            <!-- Loading state -->
            <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonLoader v-for="i in 6" :key="i" type="product-card" />
            </div>
            
            <!-- Results Grid -->
            <div v-else-if="paginatedCourses && paginatedCourses.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="course in paginatedCourses" :key="course.id">
                <ProductCard 
                  :product="course" 
                  @click="navigateToCourse(course)"
                />
              </div>
            </div>
            
            <!-- No Results (when filtered) -->
            <div v-else class="flex flex-col items-center justify-center py-20 text-center">
              <div class="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
              <p class="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
              <button 
                @click="clearFilters"
                class="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </div>
            
            <!-- Pagination (only show if we have courses and need pagination) -->
            <div 
              v-if="filteredCourses.length > coursesPerPage" 
              class="mt-10 flex items-center justify-center space-x-2"
            >
              <button 
                @click="currentPage > 1 && (currentPage--)"
                :disabled="currentPage === 1"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Previous page"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>
              
              <button 
                v-for="page in totalPages" 
                :key="page" 
                @click="currentPage = page"
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
                  currentPage === page 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="currentPage < totalPages && (currentPage++)"
                :disabled="currentPage === totalPages"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Next page"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template> 