<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'
import { useCartStore } from '../stores/cartStore'
import { CheckCircleIcon, ClockIcon, BookOpenIcon, PlayIcon, StarIcon } from '@heroicons/vue/24/solid'
import { ArrowRightIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { ElMessage, ElTabs, ElTabPane } from 'element-plus'
import AnimatedButton from '../components/ui/AnimatedButton.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import SkeletonLoader from '../components/ui/SkeletonLoader.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const cartStore = useCartStore()

const activeTab = ref('overview')
const isLoading = ref(true)
const showVideo = ref(false)
const courseId = computed(() => route.params.id as string)

// Get the course data
const course = computed(() => {
  return courseStore.getCourseById(courseId.value)
})

// Get related courses
const relatedCourses = computed(() => {
  if (!course.value) return []
  return courseStore.getRelatedCourses(courseId.value, course.value.category)
})

// Check if course is in cart
const isInCart = computed(() => {
  if (!course.value) return false
  return cartStore.isInCart(course.value.id)
})

// Format duration
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`
}

// Add to cart
const addToCart = () => {
  if (!course.value) return
  
  cartStore.addToCart(course.value)
  ElMessage({
    message: 'Course added to cart!',
    type: 'success',
  })
}

// Buy now
const buyNow = () => {
  if (!course.value) return
  
  cartStore.addToCart(course.value)
  router.push('/cart')
}

// Toggle video preview
const toggleVideoPreview = () => {
  showVideo.value = !showVideo.value
}

// Tabs navigation
const goToTab = (tab: string) => {
  activeTab.value = tab
}

// Load data
onMounted(() => {
  if (!courseStore.courses.length) {
    courseStore.fetchCourses()
  }
  
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
    
    // Scroll to top
    window.scrollTo(0, 0)
    
    // If course doesn't exist, redirect to courses page
    if (!course.value) {
      ElMessage({
        message: 'Course not found',
        type: 'error',
      })
      router.push('/courses')
    }
  }, 800)
})

// Mock curriculum data
const curriculum = [
  {
    id: 1,
    title: 'Getting Started',
    lessons: [
      { id: 1, title: 'Introduction to the Course', duration: 10, preview: true },
      { id: 2, title: 'Equipment You Will Need', duration: 15, preview: false },
      { id: 3, title: 'Safety Guidelines', duration: 12, preview: false },
    ]
  },
  {
    id: 2,
    title: 'Basic Techniques',
    lessons: [
      { id: 4, title: 'Basic Stance and Footwork', duration: 20, preview: false },
      { id: 5, title: 'The Jab', duration: 25, preview: true },
      { id: 6, title: 'The Cross', duration: 25, preview: false },
      { id: 7, title: 'The Hook', duration: 22, preview: false },
    ]
  },
  {
    id: 3,
    title: 'Combinations and Defense',
    lessons: [
      { id: 8, title: 'Basic Combinations', duration: 30, preview: false },
      { id: 9, title: 'Defensive Techniques', duration: 28, preview: false },
      { id: 10, title: 'Practice Drills', duration: 35, preview: false },
    ]
  },
  {
    id: 4,
    title: 'Advanced Techniques',
    lessons: [
      { id: 11, title: 'Advanced Footwork', duration: 22, preview: false },
      { id: 12, title: 'Complex Combinations', duration: 32, preview: false },
      { id: 13, title: 'Counterattacking', duration: 28, preview: false },
    ]
  },
]

// Mock reviews
const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://placehold.co/100x100.webp?text=SJ',
    rating: 5,
    date: '2023-10-15',
    comment: "This course completely transformed my boxing technique. The instruction is clear, detailed, and easy to follow. I've seen dramatic improvements in just a few weeks!"
  },
  {
    id: 2,
    name: 'Mike Peterson',
    avatar: 'https://placehold.co/100x100.webp?text=MP',
    rating: 4,
    date: '2023-09-22',
    comment: 'As someone who was completely new to boxing, this course provided the perfect introduction. The coach breaks everything down in a way that makes it accessible for beginners.'
  },
  {
    id: 3,
    name: 'Elena Martinez',
    avatar: 'https://placehold.co/100x100.webp?text=EM',
    rating: 5,
    date: '2023-08-05',
    comment: "The advanced techniques helped me refine my form before competitions. The tactical insights have given me an edge in the ring that I didn't have before."
  },
]

// Instructor info
const instructor = {
  name: 'Erik Pijetraj',
  title: 'Head Coach & 8x Croatian Champion',
  avatar: 'https://placehold.co/300x300.webp?text=Erik+Pijetraj',
  bio: 'Erik Pijetraj (22) is a member of the prestigious Leonardo Boxing Club in Zagreb and one of the most successful Croatian boxers in his category. As the son of legendary coach Leonardo Pijetraj, Erik grew up with boxing and developed into an outstanding athlete, and despite his youth, he already has 5 years of coaching experience.',
  achievements: [
    '8x Croatian National Champion',
    'International competition experience',
    '5+ years of coaching experience',
    'Member of Leonardo Boxing Club, Zagreb'
  ]
}

// Calculate total course duration
const totalDuration = computed(() => {
  return curriculum.reduce((total, section) => {
    return total + section.lessons.reduce((sectionTotal, lesson) => {
      return sectionTotal + lesson.duration
    }, 0)
  }, 0)
})

// Calculate total lessons
const totalLessons = computed(() => {
  return curriculum.reduce((total, section) => {
    return total + section.lessons.length
  }, 0)
})

// Calculate average rating
const averageRating = computed(() => {
  if (!reviews.length) return 0
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return (total / reviews.length).toFixed(1)
})
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="animate-pulse">
        <div class="h-72 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-6 h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mt-4 flex gap-4">
          <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="col-span-2 space-y-4">
            <div class="h-6 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-6 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-6 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="col-span-1 h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
    
    <!-- Course detail content -->
    <div v-else-if="course" class="pb-20">
      <!-- Hero Section -->
      <section class="relative bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <img 
            :src="course.image" 
            :alt="course.title" 
            class="h-full w-full object-cover opacity-30 scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/60"></div>
        </div>
        
        <div class="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div class="flex flex-col items-start gap-4">
            <div class="flex flex-wrap gap-2">
              <span class="badge bg-primary text-white">{{ course.category }}</span>
              <span class="badge bg-white/80 text-gray-800 backdrop-blur-sm">{{ course.level }}</span>
            </div>
            
            <h1 class="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {{ course.title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 text-white/90">
              <div class="flex items-center">
                <div class="flex">
                  <StarIcon 
                    v-for="i in 5" 
                    :key="i" 
                    :class="[
                      'h-5 w-5', 
                      i <= Math.floor(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'
                    ]" 
                  />
                </div>
                <span class="ml-2 text-sm">
                  {{ averageRating }} ({{ reviews.length }} reviews)
                </span>
              </div>
              
              <div class="flex items-center">
                <ClockIcon class="mr-1.5 h-5 w-5 text-primary-300" />
                <span>{{ formatDuration(totalDuration) }}</span>
              </div>
              
              <div class="flex items-center">
                <BookOpenIcon class="mr-1.5 h-5 w-5 text-primary-300" />
                <span>{{ totalLessons }} lessons</span>
              </div>
            </div>
            
            <p class="mt-2 max-w-3xl text-lg text-white/80">
              {{ course.shortDescription }}
            </p>
            
            <div class="mt-6 flex flex-wrap items-center gap-4">
              <AnimatedButton 
                v-if="!isInCart" 
                primary 
                size="lg"
                @click="addToCart"
              >
                <ShoppingCartIcon class="mr-2 h-5 w-5" />
                <span>Add to Cart - ${{ course.price.toFixed(2) }}</span>
              </AnimatedButton>
              
              <AnimatedButton 
                v-else 
                secondary
                size="lg"
                @click="router.push('/cart')"
              >
                <ShoppingCartIcon class="mr-2 h-5 w-5" />
                <span>Go to Cart</span>
              </AnimatedButton>
              
              <AnimatedButton 
                v-if="!isInCart" 
                outline
                size="lg"
                @click="buyNow"
              >
                Buy Now
              </AnimatedButton>
              
              <button
                @click="toggleVideoPreview"
                class="flex items-center gap-2 text-white underline underline-offset-4 transition-colors hover:text-primary-300"
              >
                <PlayIcon class="h-5 w-5" />
                <span>Watch Preview</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <!-- Left Column: Tabs and Content -->
          <div class="col-span-2">
            <!-- Tabs -->
            <div class="mb-8">
              <ElTabs v-model="activeTab" class="custom-tabs">
                <ElTabPane name="overview">
                  <template #label>Overview</template>
                </ElTabPane>
                <ElTabPane name="curriculum">
                  <template #label>Curriculum</template>
                </ElTabPane>
                <ElTabPane name="instructor">
                  <template #label>Instructor</template>
                </ElTabPane>
                <ElTabPane name="reviews">
                  <template #label>Reviews</template>
                </ElTabPane>
              </ElTabs>
            </div>
            
            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="space-y-8">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white section-heading">About This Course</h2>
                  <div class="mt-6 prose max-w-none dark:prose-invert">
                    <p>{{ course.description || 'No description available.' }}</p>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white section-heading">What You'll Learn</h3>
                  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div 
                      v-for="(objective, index) in course.objectives || []" 
                      :key="index" 
                      class="flex items-start"
                    >
                      <CheckCircleIcon class="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">{{ objective }}</span>
                    </div>
                    
                    <!-- If no objectives available, show placeholders -->
                    <template v-if="!course.objectives || course.objectives.length === 0">
                      <div v-for="i in 6" :key="i" class="flex items-start">
                        <CheckCircleIcon class="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span class="ml-3 text-gray-700 dark:text-gray-300">
                          {{
                            [
                              'Master the proper boxing stance and footwork',
                              'Learn correct punching techniques for maximum power',
                              'Develop effective defensive skills and counter strategies',
                              'Improve your speed, timing, and precision',
                              'Build conditioning specific to boxing',
                              'Understand ring strategy and fight tactics'
                            ][i-1]
                          }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white section-heading">Requirements</h3>
                  <ul class="mt-6 list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>No prior boxing experience required - suitable for complete beginners</li>
                    <li>Basic fitness level recommended but not required</li>
                    <li>Boxing gloves, hand wraps, and a heavy bag (for practice)</li>
                    <li>Dedication and willingness to practice regularly</li>
                  </ul>
                </div>
              </div>
              
              <!-- Curriculum Tab -->
              <div v-if="activeTab === 'curriculum'" class="space-y-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white section-heading">Course Content</h2>
                
                <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center">
                    <BookOpenIcon class="mr-1.5 h-5 w-5 text-primary" />
                    <span>{{ totalLessons }} lessons</span>
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="mr-1.5 h-5 w-5 text-primary" />
                    <span>{{ formatDuration(totalDuration) }} total length</span>
                  </div>
                </div>
                
                <div class="mt-6 space-y-4">
                  <div 
                    v-for="section in curriculum" 
                    :key="section.id" 
                    class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Section {{ section.id }}: {{ section.title }}
                      </h3>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ section.lessons.length }} lessons • 
                        {{ formatDuration(section.lessons.reduce((total, lesson) => total + lesson.duration, 0)) }}
                      </span>
                    </div>
                    
                    <div class="divide-y divide-gray-200 dark:divide-gray-700">
                      <div 
                        v-for="lesson in section.lessons" 
                        :key="lesson.id" 
                        class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                      >
                        <div class="flex items-center">
                          <PlayIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                          <span>{{ lesson.title }}</span>
                          <span 
                            v-if="lesson.preview" 
                            class="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            Preview
                          </span>
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDuration(lesson.duration) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Instructor Tab -->
              <div v-if="activeTab === 'instructor'" class="space-y-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white section-heading">Instructor</h2>
                
                <div class="flex flex-col sm:flex-row gap-8">
                  <div class="w-40 h-40 shrink-0 rounded-lg overflow-hidden">
                    <img 
                      :src="instructor.avatar" 
                      :alt="instructor.name" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ instructor.name }}</h3>
                    <p class="text-primary">{{ instructor.title }}</p>
                    
                    <div class="mt-4 prose max-w-none dark:prose-invert">
                      <p>{{ instructor.bio }}</p>
                    </div>
                    
                    <h4 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">Achievements</h4>
                    <ul class="mt-3 space-y-2">
                      <li 
                        v-for="(achievement, index) in instructor.achievements" 
                        :key="index" 
                        class="flex items-start"
                      >
                        <CheckCircleIcon class="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span class="ml-3 text-gray-700 dark:text-gray-300">{{ achievement }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <!-- Reviews Tab -->
              <div v-if="activeTab === 'reviews'" class="space-y-8">
                <div class="flex items-center justify-between">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white section-heading">Student Reviews</h2>
                </div>
                
                <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div class="col-span-2 sm:col-span-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div class="text-5xl font-bold text-gray-900 dark:text-white">{{ averageRating }}</div>
                    <div class="mt-2 flex">
                      <StarIcon 
                        v-for="i in 5" 
                        :key="i" 
                        :class="[
                          'h-6 w-6', 
                          i <= Math.floor(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'
                        ]" 
                      />
                    </div>
                    <div class="mt-2 text-gray-600 dark:text-gray-400">{{ reviews.length }} reviews</div>
                  </div>
                  
                  <div class="col-span-2 sm:col-span-1 flex flex-col justify-center">
                    <div class="space-y-2">
                      <div v-for="i in 5" :key="i" class="flex items-center">
                        <div class="w-24 flex justify-end">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ 6 - i }} stars</span>
                        </div>
                        <div class="ml-4 flex-1">
                          <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                              class="h-2 rounded-full bg-yellow-400" 
                              :style="{
                                width: `${
                                  (reviews.filter(r => r.rating === 6 - i).length / reviews.length) * 100
                                }%`
                              }"
                            ></div>
                          </div>
                        </div>
                        <div class="ml-4 w-16 text-sm text-gray-600 dark:text-gray-400">
                          {{ 
                            Math.round((reviews.filter(r => r.rating === 6 - i).length / reviews.length) * 100) 
                          }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 space-y-6">
                  <div 
                    v-for="review in reviews" 
                    :key="review.id" 
                    class="rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <img 
                          :src="review.avatar" 
                          :alt="review.name" 
                          class="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ review.name }}</h4>
                        <div class="mt-1 flex items-center">
                          <div class="flex">
                            <StarIcon 
                              v-for="i in 5" 
                              :key="i" 
                              :class="[
                                'h-4 w-4', 
                                i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              ]" 
                            />
                          </div>
                          <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {{ new Date(review.date).toLocaleDateString() }}
                          </span>
                        </div>
                        <div class="mt-3 text-gray-700 dark:text-gray-300">
                          {{ review.comment }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Sidebar -->
          <div class="col-span-1">
            <!-- Video preview modal -->
            <div
              v-if="showVideo"
              class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              @click.self="toggleVideoPreview"
            >
              <div class="relative w-full max-w-4xl">
                <button
                  @click="toggleVideoPreview"
                  class="absolute -right-8 -top-8 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none"
                >
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    class="h-full w-full"
                    src="https://www.youtube.com/embed/wrBqZLS-BDQ?autoplay=1"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
            
            <!-- Course card -->
            <div class="card sticky top-24 overflow-hidden">
              <div class="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  :src="course.image" 
                  :alt="course.title" 
                  class="h-full w-full object-cover" 
                />
                
                <!-- Play button overlay -->
                <div 
                  @click="toggleVideoPreview"
                  class="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 transition-opacity hover:bg-black/60"
                >
                  <button 
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white transition-transform hover:scale-110"
                  >
                    <PlayIcon class="h-8 w-8" />
                  </button>
                </div>
              </div>
              
              <div class="p-6">
                <div class="mb-4 flex items-baseline justify-between">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    ${{ course.price.toFixed(2) }}
                  </span>
                  <span v-if="course.discountPrice" class="text-lg text-gray-500 line-through dark:text-gray-400">
                    ${{ course.discountPrice.toFixed(2) }}
                  </span>
                </div>
                
                <div class="space-y-4">
                  <AnimatedButton 
                    v-if="!isInCart" 
                    primary
                    fullWidth
                    @click="addToCart"
                  >
                    <ShoppingCartIcon class="mr-2 h-5 w-5" />
                    <span>Add to Cart</span>
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    v-else 
                    secondary
                    fullWidth
                    @click="router.push('/cart')"
                  >
                    <ShoppingCartIcon class="mr-2 h-5 w-5" />
                    <span>Go to Cart</span>
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    v-if="!isInCart" 
                    outline
                    fullWidth
                    @click="buyNow"
                  >
                    Buy Now
                  </AnimatedButton>
                </div>
                
                <div class="mt-6">
                  <h4 class="font-medium text-gray-900 dark:text-white">This course includes:</h4>
                  <ul class="mt-3 space-y-2">
                    <li class="flex">
                      <BookOpenIcon class="h-5 w-5 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">{{ totalLessons }} lessons</span>
                    </li>
                    <li class="flex">
                      <ClockIcon class="h-5 w-5 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">{{ formatDuration(totalDuration) }} of video</span>
                    </li>
                    <li class="flex">
                      <CheckCircleIcon class="h-5 w-5 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">Full lifetime access</span>
                    </li>
                    <li class="flex">
                      <CheckCircleIcon class="h-5 w-5 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">Access on mobile and TV</span>
                    </li>
                    <li class="flex">
                      <CheckCircleIcon class="h-5 w-5 text-primary" />
                      <span class="ml-3 text-gray-700 dark:text-gray-300">Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Related Courses -->
      <section v-if="relatedCourses.length > 0" class="bg-gray-50 dark:bg-gray-900 py-16">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white section-heading">Related Courses</h2>
          
          <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductCard
              v-for="relatedCourse in relatedCourses.slice(0, 4)"
              :key="relatedCourse.id"
              :product="relatedCourse"
            />
          </div>
          
          <div class="mt-10 text-center">
            <router-link 
              to="/courses" 
              class="inline-flex items-center text-primary hover:text-primary-600 group"
            >
              <span>View All Courses</span>
              <ArrowRightIcon class="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.custom-tabs :deep(.el-tabs__active-bar) {
  background-color: theme('colors.primary.DEFAULT');
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: theme('colors.primary.DEFAULT');
}

.custom-tabs :deep(.el-tabs__item:hover) {
  color: theme('colors.primary.600');
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: theme('colors.gray.200');
}

.dark .custom-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: theme('colors.gray.700');
}

.dark .custom-tabs :deep(.el-tabs__item) {
  color: theme('colors.gray.400');
}

.dark .custom-tabs :deep(.el-tabs__item.is-active) {
  color: theme('colors.primary.DEFAULT');
}

.dark .custom-tabs :deep(.el-tabs__item:hover) {
  color: theme('colors.primary.400');
}
</style> 