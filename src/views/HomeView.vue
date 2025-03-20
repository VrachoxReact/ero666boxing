<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'
import { useCartStore } from '../stores/cartStore'
import { StarIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { ArrowRightIcon, ArrowLongRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useIntersectionObserver } from '@vueuse/core'

const router = useRouter()
const courseStore = useCourseStore()
const cartStore = useCartStore()

const featuredCourses = computed(() => courseStore.getFeaturedCourses.slice(0, 6))
const isLoading = ref(true)
const activeTestimonial = ref(0)
const animationElements = reactive(new Map())

// Setup intersection observer for animations
const setupAnimations = () => {
  const elements = document.querySelectorAll('.animate-on-scroll')
  
  if (!elements.length) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-bottom')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '50px' }
  )
  
  elements.forEach(el => observer.observe(el))
}

onMounted(() => {
  // Reduce initial loading time
  setTimeout(() => {
    isLoading.value = false
    // Setup animations after content is loaded, slightly delayed for better performance
    if (window.requestIdleCallback) {
      window.requestIdleCallback(setupAnimations)
    } else {
      setTimeout(setupAnimations, 200)
    }
  }, 500) // Reduced from 1000ms to 500ms
  
  // Fetch courses (in a real app, this would be an async API call)
  courseStore.fetchCourses()
})

const navigateToCourse = (courseId: string) => {
  router.push({ name: 'course-detail', params: { id: courseId } })
}

const addToCart = (course: any, event: Event) => {
  event.stopPropagation()
  cartStore.addToCart(course)
}

// Carousel controls for testimonials
const nextTestimonial = () => {
  activeTestimonial.value = (activeTestimonial.value + 1) % testimonials.length
}

const prevTestimonial = () => {
  activeTestimonial.value = (activeTestimonial.value - 1 + testimonials.length) % testimonials.length
}

const benefits = [
  {
    title: 'Learn from a Champion',
    description: 'All courses are created by an 8x Croatian national boxing champion with years of coaching experience.',
    icon: 'trophy'
  },
  {
    title: 'Step-by-Step Guidance',
    description: 'Clear instructions and demonstrations for every technique and exercise.',
    icon: 'steps'
  },
  {
    title: 'Progress at Your Pace',
    description: 'Access course materials anytime, anywhere, and learn at your own pace.',
    icon: 'clock'
  },
  {
    title: 'Community Support',
    description: 'Join a community of like-minded boxers for motivation and guidance.',
    icon: 'users'
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Amateur Boxer',
    image: 'https://placehold.co/150x150.webp?text=SJ',
    content: 'These courses transformed my boxing technique. The instruction is clear, detailed, and easy to follow. I\'ve seen dramatic improvements in just a few weeks!'
  },
  {
    name: 'Mike Peterson',
    role: 'Fitness Enthusiast',
    image: 'https://placehold.co/150x150.webp?text=MP',
    content: 'As someone who was completely new to boxing, these courses provided the perfect introduction. The coach breaks everything down in a way that makes it accessible for beginners.'
  },
  {
    name: 'Elena Martinez',
    role: 'Competitive Boxer',
    image: 'https://placehold.co/150x150.webp?text=EM',
    content: 'The advanced courses helped me refine my technique before competitions. The tactical insights have given me an edge in the ring that I didn\'t have before.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-900 py-24 sm:py-32 text-white overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://placehold.co/1920x1080.webp?text=Boxing+Hero+Image" 
          alt="Boxing Champion" 
          class="h-full w-full object-cover opacity-30 scale-105 transition-transform duration-10000 hover:scale-100"
          loading="eager" 
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/60"></div>
      </div>
      
      <div class="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="max-w-3xl animate-on-scroll opacity-0">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Master boxing with <span class="text-primary-300 relative">
              an eight-time Croatian champion
              <span class="absolute bottom-0 left-0 w-full h-1 bg-primary"></span>
            </span>
          </h1>
          <p class="mt-6 max-w-xl text-lg text-gray-300">
            Enhance your boxing skills with comprehensive online courses designed for all skill levels, from beginners to advanced fighters.
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-5">
            <router-link 
              to="/courses" 
              class="btn btn-primary group"
            >
              <span>Browse Courses</span>
              <ArrowLongRightIcon class="ml-2 h-5 w-0 opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100" />
            </router-link>
            <router-link 
              to="/about" 
              class="flex items-center text-sm font-semibold text-white transition-all duration-300 group hover:text-primary-300"
            >
              <span>Learn more about the coach</span>
              <ArrowRightIcon class="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </router-link>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-on-scroll opacity-0">
          <div class="glassmorphism rounded-lg p-6 hover-lift">
            <p class="text-4xl font-bold text-primary">8x</p>
            <p class="mt-2 text-sm text-white/80">National Champion</p>
          </div>
          <div class="glassmorphism rounded-lg p-6 hover-lift">
            <p class="text-4xl font-bold text-primary">5+</p>
            <p class="mt-2 text-sm text-white/80">Years of coaching experience</p>
          </div>
          <div class="glassmorphism rounded-lg p-6 hover-lift">
            <p class="text-4xl font-bold text-primary">1000+</p>
            <p class="mt-2 text-sm text-white/80">Satisfied students</p>
          </div>
          <div class="glassmorphism rounded-lg p-6 hover-lift">
            <p class="text-4xl font-bold text-primary">15+</p>
            <p class="mt-2 text-sm text-white/80">Online courses</p>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute bottom-0 left-0 right-0 h-16">
        <svg class="absolute bottom-0 w-full h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1440 48">
          <path fill="currentColor" d="M0 48h1440V0c-395 39-836 39-1440 0v48z" />
        </svg>
      </div>
    </section>

    <!-- Featured Courses Section -->
    <section class="py-20 animate-on-scroll opacity-0">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl section-heading centered">Featured Courses</h2>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Explore our most popular boxing courses designed for all skill levels
          </p>
        </div>

        <div v-if="isLoading" class="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card animate-pulse-light">
            <div class="aspect-w-16 aspect-h-9 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-4 h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <div v-else class="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="course in featuredCourses" 
            :key="course.id" 
            class="card hover-lift overflow-hidden group"
            @click="navigateToCourse(course.id)"
          >
            <div class="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg">
              <img 
                :src="course.image" 
                :alt="course.title" 
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                width="400"
                height="225"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span class="badge bg-primary/90 text-white backdrop-blur-sm group-hover:bg-primary transition-colors duration-300">
                  {{ course.category }}
                </span>
                <span class="badge bg-white/80 text-gray-800 backdrop-blur-sm">
                  {{ course.level }}
                </span>
              </div>
            </div>
            
            <div class="mt-5 p-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary">{{ course.title }}</h3>
              </div>
              
              <div class="mt-2 flex items-center">
                <div class="flex">
                  <StarIcon 
                    v-for="i in 5" 
                    :key="i" 
                    :class="[
                      'h-4 w-4', 
                      i <= course.rating ? 'text-yellow-400' : 'text-gray-300'
                    ]" 
                  />
                </div>
                <span class="ml-2 text-xs text-gray-500">
                  {{ course.reviews }} reviews
                </span>
              </div>
              
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ course.shortDescription }}</p>
              
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-xl font-bold text-gray-900 dark:text-white">${{ course.price.toFixed(2) }}</span>
                  <span v-if="course.discountPrice" class="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                    ${{ course.discountPrice.toFixed(2) }}
                  </span>
                </div>
                
                <button 
                  @click="addToCart(course, $event)" 
                  class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-14 text-center">
          <router-link to="/courses" class="btn btn-outline group">
            <span>View All Courses</span>
            <ArrowRightIcon class="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="bg-gray-100 py-20 dark:bg-gray-800 animate-on-scroll opacity-0">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl section-heading centered">Why Choose Our Courses</h2>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Learn from the best with our expert-led boxing instruction
          </p>
        </div>
        
        <div class="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(benefit, index) in benefits" :key="index" class="flex flex-col items-center text-center hover-lift p-6 rounded-lg bg-white dark:bg-gray-700">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20 animate-float">
              <CheckCircleIcon class="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">{{ benefit.title }}</h3>
            <p class="mt-4 text-base text-gray-500 dark:text-gray-400">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Instructor Section -->
    <section class="py-20 animate-on-scroll opacity-0">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl section-heading">
              Learn from an eight-time Croatian champion
            </h2>
            <p class="mt-6 text-lg text-gray-500 dark:text-gray-400">
              Erik Pijetraj (27) is a member of the prestigious Boxing Club Leonardo from Zagreb and one of the most successful Croatian boxers in his category. As the son of legendary coach Leonardo Pijetraj, Erik grew up with boxing and developed into an exceptional athlete, and despite his youth, he already has 5 years of coaching experience.
            </p>
            <div class="mt-8 space-y-4">
              <div class="flex group">
                <div class="h-6 w-6 flex-shrink-0 text-primary transition-all duration-300 group-hover:scale-110">
                  <CheckCircleIcon class="h-6 w-6" />
                </div>
                <p class="ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Eight-time Croatian boxing champion</p>
              </div>
              <div class="flex group">
                <div class="h-6 w-6 flex-shrink-0 text-primary transition-all duration-300 group-hover:scale-110">
                  <CheckCircleIcon class="h-6 w-6" />
                </div>
                <p class="ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Over 5 years of coaching experience</p>
              </div>
              <div class="flex group">
                <div class="h-6 w-6 flex-shrink-0 text-primary transition-all duration-300 group-hover:scale-110">
                  <CheckCircleIcon class="h-6 w-6" />
                </div>
                <p class="ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Member of Boxing Club Leonardo from Zagreb</p>
              </div>
              <div class="flex group">
                <div class="h-6 w-6 flex-shrink-0 text-primary transition-all duration-300 group-hover:scale-110">
                  <CheckCircleIcon class="h-6 w-6" />
                </div>
                <p class="ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Competed in international competitions and Olympic qualifications</p>
              </div>
            </div>
            <div class="mt-10">
              <router-link to="/about" class="btn btn-primary group">
                <span>About the Coach</span>
                <ArrowRightIcon class="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </router-link>
            </div>
          </div>
          <div class="relative">
            <div class="absolute -top-8 -left-8 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-8 -right-8 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
            <img 
              src="https://placehold.co/600x800.webp?text=Erik+Pijetraj" 
              alt="Erik Pijetraj Boxing Coach" 
              class="relative rounded-lg shadow-xl hover-lift overflow-hidden" 
              loading="lazy"
              width="600" 
              height="800"
            />
            <div class="absolute -bottom-6 -left-6 rounded-lg bg-primary p-6 text-white shadow-lg hover-lift">
              <p class="text-xl font-bold">Erik Pijetraj</p>
              <p class="text-sm">Head Coach & Founder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="bg-gray-100 py-20 dark:bg-gray-800 animate-on-scroll opacity-0">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl section-heading centered">What Our Students Say</h2>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Hear from boxers who have transformed their skills with our courses
          </p>
        </div>
        
        <div class="mt-14 relative">
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${activeTestimonial * 100}%)` }">
              <div v-for="(testimonial, index) in testimonials" :key="index" class="w-full flex-shrink-0 px-4">
                <div class="card hover-lift mx-auto max-w-3xl">
                  <div class="flex flex-col items-center text-center">
                    <div class="flex">
                      <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 text-yellow-400" />
                    </div>
                    <p class="mt-6 text-lg text-gray-600 dark:text-gray-300">{{ testimonial.content }}</p>
                    <div class="mt-8 flex flex-col items-center">
                      <div class="h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary shadow-lg">
                        <img :src="testimonial.image" :alt="testimonial.name" class="h-full w-full object-cover" />
                      </div>
                      <div class="mt-4">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ testimonial.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.role }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Controls -->
          <div class="mt-10 flex justify-center space-x-2">
            <button 
              @click="prevTestimonial" 
              class="rounded-full p-2 text-primary transition-all duration-300 hover:bg-primary hover:text-white focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon class="h-6 w-6" />
            </button>
            <div class="flex items-center space-x-2">
              <button 
                v-for="(_, index) in testimonials" 
                :key="index"
                @click="activeTestimonial = index"
                class="h-2 w-2 rounded-full transition-all duration-300 focus:outline-none"
                :class="index === activeTestimonial ? 'bg-primary w-6' : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary/70'"
                :aria-label="`Go to testimonial ${index + 1}`"
                :aria-current="index === activeTestimonial ? 'true' : 'false'"
              ></button>
            </div>
            <button 
              @click="nextTestimonial" 
              class="rounded-full p-2 text-primary transition-all duration-300 hover:bg-primary hover:text-white focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="relative overflow-hidden bg-primary py-32 text-center text-white animate-on-scroll opacity-0">
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://placehold.co/1920x1080.webp?text=Boxing+CTA+Background" 
          alt="Boxing" 
          class="h-full w-full object-cover opacity-10 scale-105 transition-transform duration-10000 hover:scale-100"
          loading="lazy"
          width="1920"
          height="1080"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
      </div>
      <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl">
          <h2 class="text-4xl font-bold">Ready to Take Your Boxing Skills to the Next Level?</h2>
          <p class="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Join thousands of students who have transformed their boxing technique with our expert-led courses.
          </p>
          <div class="mt-10 flex justify-center">
            <router-link to="/courses" class="btn bg-white px-8 py-4 text-primary shadow-xl hover:bg-gray-100 group">
              <span>Explore All Courses</span>
              <ArrowLongRightIcon class="ml-2 h-5 w-0 opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100" />
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Decorative wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-16" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path fill="white" d="M0,48 L1440,48 L1440,0 C1139.02,20 857.045,30 576.032,30 C295.019,30 124.502,20 0,0 L0,48 Z"></path>
        </svg>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Add will-change to optimize animations for GPU acceleration */
.animate-on-scroll {
  will-change: opacity, transform;
}

/* Override the default animation duration to be more performant */
.animate-slide-in-bottom {
  animation-duration: 400ms;
}

/* Use hardware acceleration for transitions where appropriate */
.hover-lift {
  will-change: transform, box-shadow;
  transform: translateZ(0);
}
</style> 