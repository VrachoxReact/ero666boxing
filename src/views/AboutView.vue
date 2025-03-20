<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrophyIcon, UserGroupIcon, AcademicCapIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

const isLoading = ref(true)

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Erik Pijetraj',
    role: 'Head Coach & Founder',
    bio: 'Erik is an eight-time Croatian boxing champion and a member of the prestigious Boxing Club Leonardo from Zagreb. As the son of legendary coach Leonardo Pijetraj, Erik grew up with boxing and developed into an exceptional athlete. Despite his youth (22 years), Erik is also an experienced coach - he has been teaching boxing for five years, having started his coaching career at just 15 years old.',
    image: 'https://placehold.co/300x400.webp?text=Erik+Pijetraj',
    socialLinks: {
      instagram: '#',
      facebook: '#',
      twitter: '#'
    }
  },
  {
    id: 2,
    name: 'Maria Kovács',
    role: 'Fitness & Conditioning Coach',
    bio: 'Maria specializes in boxing-specific strength and conditioning. With a background in sports science, she creates tailored fitness programs that help boxers improve their endurance, power, and overall performance.',
    image: 'https://placehold.co/300x400.webp?text=Maria+Kovacs',
    socialLinks: {
      instagram: '#',
      facebook: '#'
    }
  },
  {
    id: 3,
    name: 'David Lee',
    role: 'Technical Boxing Coach',
    bio: 'David is a former professional boxer with a record of 22-3. His technical knowledge and attention to detail have made him a valuable addition to our coaching team, focusing on advanced techniques and strategy.',
    image: 'https://placehold.co/300x400.webp?text=David+Lee',
    socialLinks: {
      instagram: '#',
      twitter: '#'
    }
  }
]

// Achievements and milestones
const achievements = [
  {
    year: '2016',
    title: 'Olympic Qualifications',
    description: 'Erik participated in the Olympic qualifications in Turkey (Samsun).'
  },
  {
    year: '2017',
    title: 'Beginning of Coaching Career',
    description: 'At just 15 years old, Erik began his coaching career, parallel to his competitive career.'
  },
  {
    year: '2018',
    title: 'National Championship',
    description: 'He won the national championship in the 64 kg category despite a hand injury.'
  },
  {
    year: '2019',
    title: 'International Competitions',
    description: 'Successfully competed in numerous international competitions, including the European Games.'
  },
  {
    year: '2022',
    title: 'Eighth Croatian Champion Title',
    description: 'Erik won his eighth national champion title, continuing his dominance in his category.'
  },
  {
    year: '2024',
    title: 'Launch of Online Courses',
    description: 'Started a series of online boxing courses to share his knowledge and techniques with a wider audience.'
  }
]

// Values for the academy
const values = [
  {
    icon: TrophyIcon,
    title: 'Excellence',
    description: 'We strive for technical excellence in every aspect of our teaching and training methods.'
  },
  {
    icon: UserGroupIcon,
    title: 'Accessibility',
    description: 'We believe quality boxing instruction should be accessible to everyone, regardless of their background or experience level.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Education',
    description: 'We focus on teaching not just techniques, but the principles and strategies behind them.'
  },
  {
    icon: ClockIcon,
    title: 'Dedication',
    description: 'We emphasize the importance of consistent practice and dedication to the craft of boxing.'
  }
]

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="container mx-auto animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div class="h-12 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="mt-8 h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
    
    <template v-else>
      <!-- Hero Section -->
      <section class="relative bg-gray-900 py-24 text-white">
        <div class="absolute inset-0 overflow-hidden">
          <img 
            src="https://placehold.co/1920x1080.webp?text=Boxing+Gym+Background" 
            alt="Boxing Gym" 
            class="h-full w-full object-cover opacity-20"
            loading="eager" 
            fetchpriority="high"
          />
        </div>
        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <h1 class="text-4xl font-bold sm:text-5xl md:text-6xl">
              About <span class="text-primary">Erik Pijetraj</span> Boxing
            </h1>
            <p class="mt-6 text-xl text-gray-300">
              Learn boxing from an eight-time Croatian champion with proven techniques and comprehensive courses designed for all skill levels.
            </p>
          </div>
        </div>
      </section>
      
      <!-- Our Story Section -->
      <section class="py-16 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Our Story</h2>
              <div class="mt-6 space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  Erik Pijetraj is a member of the prestigious Boxing Club Leonardo from Zagreb and one of the most successful Croatian boxers in his category. As the son of legendary coach Leonardo Pijetraj, Erik grew up with boxing and developed into an exceptional athlete.
                </p>
                <p>
                  "I am an athlete who maintains form throughout the year. Even when I take a break from training, I live and eat healthily. This is constantly present in my life."
                </p>
                <p>
                  Erik believes in the holistic preparation of athletes - technical development, physical fitness, mental toughness, and a healthy lifestyle. His experiences with his own challenges, including injury management, give him a deep understanding of each boxer's needs.
                </p>
                <p>
                  Erik's boxing journey hasn't been without challenges. He has faced numerous injuries that temporarily took him away from the ring, including a shoulder problem (a year and a half break), a foot injury, a hand fracture, and chronic migraines. Despite these obstacles, he has shown exceptional mental strength and dedication, making him an ideal mentor.
                </p>
              </div>
            </div>
            <div class="relative">
              <img 
                src="https://placehold.co/800x600.webp?text=Erik+Pijetraj+Boxing" 
                alt="Erik Pijetraj Boxing" 
                class="rounded-lg shadow-xl"
                loading="lazy"
                width="800"
                height="600"
              />
              <div class="absolute -bottom-6 -left-6 rounded-lg bg-primary p-6 shadow-lg">
                <div class="text-3xl font-bold text-white">5+</div>
                <div class="text-sm font-medium uppercase tracking-wide text-white/80">Years of Coaching</div>
              </div>
              <div class="absolute -right-6 -top-6 rounded-lg bg-gray-900 p-6 shadow-lg">
                <div class="text-3xl font-bold text-white">8x</div>
                <div class="text-sm font-medium uppercase tracking-wide text-white/80">National Champion</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Values Section -->
      <section class="bg-gray-100 py-16 dark:bg-gray-800 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
            <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Our academy is built on these fundamental principles that guide everything we do
            </p>
          </div>
          
          <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div 
              v-for="(value, index) in values" 
              :key="index"
              class="rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700"
            >
              <component 
                :is="value.icon" 
                class="h-12 w-12 text-primary"
              />
              <h3 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {{ value.title }}
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{ value.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Meet the Team Section -->
      <section class="py-16 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Meet Our Coaches</h2>
            <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Our team of experienced coaches is dedicated to helping you achieve your full potential
            </p>
          </div>
          
          <div class="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="member in teamMembers" 
              :key="member.id"
              class="group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700"
            >
              <div class="relative aspect-[3/4] overflow-hidden">
                <img 
                  :src="member.image" 
                  :alt="member.name" 
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width="300"
                  height="400"
                />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                <p class="text-sm font-medium text-primary">{{ member.role }}</p>
                <p class="mt-4 text-gray-600 dark:text-gray-300">{{ member.bio }}</p>
                
                <div class="mt-6 flex space-x-4">
                  <a 
                    v-if="member.socialLinks.instagram"
                    :href="member.socialLinks.instagram" 
                    class="text-gray-400 transition-colors hover:text-primary dark:text-gray-300"
                    aria-label="Instagram"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    v-if="member.socialLinks.facebook"
                    :href="member.socialLinks.facebook" 
                    class="text-gray-400 transition-colors hover:text-primary dark:text-gray-300"
                    aria-label="Facebook"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    v-if="member.socialLinks.twitter"
                    :href="member.socialLinks.twitter" 
                    class="text-gray-400 transition-colors hover:text-primary dark:text-gray-300"
                    aria-label="Twitter"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Achievements Section -->
      <section class="bg-gray-100 py-16 dark:bg-gray-800 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Achievements and Milestones</h2>
            <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Erik's boxing journey and significant moments in the development of our academy
            </p>
          </div>
          
          <div class="mt-16 relative">
            <!-- Timeline line -->
            <div class="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-300 dark:bg-gray-600"></div>
            
            <div class="space-y-16">
              <div 
                v-for="(achievement, index) in achievements" 
                :key="index"
                class="relative"
                :class="{ 'lg:flex-row-reverse': index % 2 !== 0 }"
              >
                <!-- Timeline dot -->
                <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <span class="text-xs font-bold">{{ achievement.year }}</span>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="grid gap-8 lg:grid-cols-2">
                  <div :class="{ 'lg:col-start-2': index % 2 === 0 }">
                    <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700">
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ achievement.title }}</h3>
                      <p class="mt-2 text-gray-600 dark:text-gray-300">{{ achievement.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- BK Leonardo Section -->
      <section class="py-16 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Boxing Pedigree: BK Leonardo</h2>
              <div class="mt-6 space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  Erik is a proud member of Boxing Club Leonardo, one of the most successful Croatian boxing clubs founded by his father Leonardo Pijetraj in 1992. Many significant names in Croatian and international boxing have come through this club, including Olympic representatives and professional champions.
                </p>
                <p>
                  For Erik, the advantage of training in this club has always been clear: "When I finally calm down, it's clear to me that I have not only the best coach in Croatia, but also in the world."
                </p>
                <p>
                  Erik Pijetraj's coaching approach reflects the high standards learned from his father, with a personal style that gives him a unique perspective. His holistic approach includes technical development, physical fitness, mental toughness, and a healthy lifestyle.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://placehold.co/1920x1080.webp?text=Boxing+Club" 
                alt="Boxing Club Leonardo" 
                class="rounded-lg shadow-xl"
                loading="lazy"
                width="1920"
                height="1080"
              />
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="bg-primary py-16 text-white">
        <div class="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold">Ready to Start Your Boxing Journey?</h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Explore our comprehensive boxing courses and take your skills to the next level.
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <router-link to="/courses" class="btn bg-white text-primary hover:bg-gray-100">
              Browse Courses
            </router-link>
            <router-link to="/contact" class="btn border border-white bg-transparent text-white hover:bg-white/10">
              Contact Us
            </router-link>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* Add performance optimizations */
.hover-shadow-xl {
  will-change: box-shadow;
}

.group:hover img {
  will-change: transform;
}

/* Preconnect to external resources */
@import url('data:text/css;charset=UTF-8,*%7B-webkit-font-smoothing%3Aantialiased%3B%7D');
</style> 