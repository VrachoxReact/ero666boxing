import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Define course related types
export interface Course {
  id: number
  title: string
  description: string
  image: string
  price: number
  discountPrice?: number
  instructor: string
  rating: number
  reviewCount: number
  category: string
  level: string
  duration: string
  language: string
  totalLessons: number
  totalStudents: number
  featured: boolean
  tags: string[]
  updatedAt: string
  createdAt: string
}

export interface CourseDetail extends Course {
  videoUrl: string
  curriculum: CourseCurriculum[]
  reviews: CourseReview[]
  objectives: string[]
  requirements: string[]
  description: string
  fullDescription: string
}

export interface CourseCurriculum {
  title: string
  lessons: CourseLesson[]
}

export interface CourseLesson {
  id: number
  title: string
  duration: string
  type: 'video' | 'quiz' | 'text'
  preview: boolean
}

export interface CourseReview {
  id: number
  user: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [
      {
        id: '1',
        title: 'Boxing Fundamentals for Beginners',
        category: 'Fundamentals',
        level: 'Beginner',
        price: 49.99,
        discountPrice: 69.99,
        rating: 4.8,
        reviews: 124,
        image: 'https://placehold.co/800x450.webp?text=Boxing+Fundamentals',
        featured: true,
        shortDescription: 'Master the basic techniques of boxing with this comprehensive beginner course.',
        description: 'This course covers all the essential techniques for beginners, including stance, footwork, and basic punches. Learn proper form and technique from an 8x national champion.'
      },
      {
        id: '2',
        title: 'Advanced Boxing Combinations',
        category: 'Technique',
        level: 'Advanced',
        price: 79.99,
        discountPrice: 99.99,
        rating: 4.9,
        reviews: 87,
        image: 'https://placehold.co/800x450.webp?text=Advanced+Combinations',
        featured: true,
        shortDescription: 'Take your boxing to the next level with complex combinations and advanced techniques.',
        description: 'Designed for experienced boxers, this course focuses on advanced combinations, timing, and strategic techniques to improve your performance in the ring.'
      },
      {
        id: '3',
        title: 'Boxing Conditioning & Fitness',
        category: 'Fitness',
        level: 'Intermediate',
        price: 59.99,
        discountPrice: null,
        rating: 4.7,
        reviews: 93,
        image: 'https://placehold.co/800x450.webp?text=Boxing+Fitness',
        featured: true,
        shortDescription: 'Build endurance, strength and conditioning specifically designed for boxers.',
        description: 'Improve your stamina, power, and overall fitness with boxing-specific workouts designed to enhance your performance and prevent fatigue during matches.'
      },
      {
        id: '4',
        title: 'Defensive Boxing Masterclass',
        category: 'Defense',
        level: 'Intermediate',
        price: 69.99,
        discountPrice: 89.99,
        rating: 4.6,
        reviews: 78,
        image: 'https://placehold.co/800x450.webp?text=Defensive+Boxing',
        featured: true,
        shortDescription: 'Master the art of defense with techniques from championship boxers.',
        description: 'Learn advanced defensive techniques including slips, rolls, blocks, and counters. This course will teach you how to become an elusive target while setting up perfect counter opportunities.'
      },
      {
        id: '5',
        title: 'Power Punching Techniques',
        category: 'Technique',
        level: 'Intermediate',
        price: 64.99,
        discountPrice: null,
        rating: 4.8,
        reviews: 112,
        image: 'https://placehold.co/800x450.webp?text=Power+Punching',
        featured: true,
        shortDescription: 'Increase your punching power through proper technique and body mechanics.',
        description: 'Discover the secrets to generating maximum power in your punches through proper body mechanics, weight transfer, and technique refinement. Learn how champions develop knockout power.'
      },
      {
        id: '6',
        title: 'Footwork Fundamentals',
        category: 'Fundamentals',
        level: 'Beginner',
        price: 39.99,
        discountPrice: 54.99,
        rating: 4.7,
        reviews: 65,
        image: 'https://placehold.co/800x450.webp?text=Footwork+Fundamentals',
        featured: false,
        shortDescription: 'Master the essential footwork patterns that form the foundation of boxing movement.',
        description: 'Proper footwork is the foundation of all boxing skills. This course breaks down essential movement patterns, weight distribution, and positioning techniques to improve your mobility and effectiveness.'
      },
      {
        id: '7',
        title: 'Counter Punching Strategies',
        category: 'Strategy',
        level: 'Advanced',
        price: 74.99,
        discountPrice: null,
        rating: 4.9,
        reviews: 56,
        image: 'https://placehold.co/800x450.webp?text=Counter+Punching',
        featured: true,
        shortDescription: 'Learn to read your opponent and deliver perfectly timed counter punches.',
        description: 'Develop the ability to read your opponent, anticipate attacks, and deliver devastating counter punches. This advanced course teaches timing, distance control, and strategic counter combinations.'
      },
      {
        id: '8',
        title: 'Boxing for Self-Defense',
        category: 'Self-Defense',
        level: 'Beginner',
        price: 54.99,
        discountPrice: 69.99,
        rating: 4.6,
        reviews: 103,
        image: 'https://placehold.co/800x450.webp?text=Self+Defense',
        featured: false,
        shortDescription: 'Practical boxing techniques adapted for real-world self-defense situations.',
        description: 'Learn how to apply boxing techniques in practical self-defense scenarios. This course focuses on awareness, defense against common attacks, and techniques modified for street situations.'
      },
      {
        id: '9',
        title: 'Competition Preparation',
        category: 'Competition',
        level: 'Advanced',
        price: 89.99,
        discountPrice: 109.99,
        rating: 4.8,
        reviews: 42,
        image: 'https://placehold.co/800x450.webp?text=Competition+Prep',
        featured: false,
        shortDescription: 'Complete preparation guide for amateur boxing competitions.',
        description: 'Prepare yourself physically and mentally for amateur boxing competitions. This comprehensive course covers training schedules, weight management, strategy development, and mental preparation.'
      },
      {
        id: '10',
        title: 'Boxing Nutrition & Recovery',
        category: 'Fitness',
        level: 'All Levels',
        price: 44.99,
        discountPrice: null,
        rating: 4.7,
        reviews: 89,
        image: 'https://placehold.co/800x450.webp?text=Boxing+Nutrition',
        featured: false,
        shortDescription: 'Optimize your performance with proper nutrition and recovery protocols.',
        description: 'Learn how to fuel your body for boxing training and competition. This course covers meal timing, macronutrient balance, hydration strategies, and effective recovery protocols to enhance performance.'
      },
      {
        id: '11',
        title: 'Southpaw Boxing Techniques',
        category: 'Technique',
        level: 'Intermediate',
        price: 59.99,
        discountPrice: 74.99,
        rating: 4.8,
        reviews: 36,
        image: 'https://placehold.co/800x450.webp?text=Southpaw+Techniques',
        featured: false,
        shortDescription: 'Specialized techniques and strategies for left-handed boxers.',
        description: 'This specialized course is designed for southpaw (left-handed) boxers, covering unique techniques, advantages, and strategies. Also valuable for orthodox boxers wanting to understand how to face southpaw opponents.'
      },
      {
        id: '12',
        title: 'Inside Fighting Mastery',
        category: 'Technique',
        level: 'Advanced',
        price: 69.99,
        discountPrice: null,
        rating: 4.9,
        reviews: 47,
        image: 'https://placehold.co/800x450.webp?text=Inside+Fighting',
        featured: true,
        shortDescription: 'Master the art of close-range boxing with advanced inside fighting techniques.',
        description: 'Develop your inside fighting game with techniques for close-range combat. Learn how to work in the pocket with short punches, body shots, clinch work, and defensive maneuvers for close-quarters boxing.'
      },
      {
        id: '13',
        title: 'Youth Boxing Fundamentals',
        category: 'Fundamentals',
        level: 'Beginner',
        price: 39.99,
        discountPrice: null,
        rating: 4.7,
        reviews: 58,
        image: 'https://placehold.co/800x450.webp?text=Youth+Boxing',
        featured: false,
        shortDescription: 'Age-appropriate introduction to boxing fundamentals for young athletes.',
        description: 'A safe, age-appropriate introduction to boxing for young athletes. This course emphasizes proper technique, discipline, fitness, and sportsmanship while keeping training fun and engaging.'
      },
      {
        id: '14',
        title: 'Boxing Conditioning Circuit Training',
        category: 'Fitness',
        level: 'Intermediate',
        price: 49.99,
        discountPrice: 64.99,
        rating: 4.8,
        reviews: 76,
        image: 'https://placehold.co/800x450.webp?text=Boxing+Circuits',
        featured: false,
        shortDescription: 'High-intensity circuit training designed specifically for boxing athletes.',
        description: 'Improve your boxing-specific conditioning with high-intensity circuit training workouts. These efficient, effective sessions will build the strength, power, and endurance needed for boxing performance.'
      },
      {
        id: '15',
        title: 'Mental Training for Boxers',
        category: 'Mental Training',
        level: 'All Levels',
        price: 54.99,
        discountPrice: null,
        rating: 4.9,
        reviews: 63,
        image: 'https://placehold.co/800x450.webp?text=Mental+Training',
        featured: true,
        shortDescription: 'Develop the mental toughness and psychological skills essential for boxing success.',
        description: 'Boxing is as much mental as it is physical. This course teaches visualization, focus techniques, emotional control, confidence building, and psychological strategies for both training and competition.'
      }
    ],
    featuredCourses: ref<Course[]>([]),
    isLoading: ref(false),
    error: ref<string | null>(null)
  }),
  getters: {
    allCourses() {
      return this.courses || []
    },
    getFeaturedCourses() {
      return this.courses.filter(course => course.featured) || []
    },
    getCourseById: (state) => (id: string) => {
      return state.courses.find(course => course.id === id)
    },
    getCoursesByCategory: (state) => (category: string) => {
      return state.courses.filter(course => course.category === category)
    },
    getCoursesByLevel: (state) => (level: string) => {
      return state.courses.filter(course => course.level === level)
    },
    getRelatedCourses: (state) => (currentId: string, category: string) => {
      return state.courses
        .filter(course => course.id !== currentId && course.category === category)
        .slice(0, 4)
    },
    getAllCategories: (state) => {
      const categories = new Set(state.courses.map(course => course.category))
      return Array.from(categories)
    },
    getAllLevels: (state) => {
      const levels = new Set(state.courses.map(course => course.level))
      return Array.from(levels)
    }
  },
  actions: {
    async fetchCourses() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('Fetching courses, current count:', this.courses.length)
        // In a real application, you would fetch data from an API
        // Here we're just simulating a delay since the courses data is already in state
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Ensure the courses array is properly initialized
        if (!Array.isArray(this.courses) || this.courses.length === 0) {
          console.error('Courses array is empty or not properly initialized')
          throw new Error('Courses not available')
        }
        
        // Just set the featured courses
        this.featuredCourses = this.courses.filter(course => course.featured)
        console.log('Featured courses:', this.featuredCourses.length)
        
        return this.courses
      } catch (err) {
        console.error('Error fetching courses:', err)
        this.error = 'Failed to load courses. Please try again later.'
        
        ElMessage({
          message: 'Failed to load courses',
          type: 'error',
        })
        
        return []
      } finally {
        this.isLoading = false
      }
    },
    async fetchCourseById(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600))
        
        const course = this.courses.find(course => course.id === id)
        
        if (!course) {
          throw new Error('Course not found')
        }
        
        return course
      } catch (err) {
        console.error(`Error fetching course with ID ${id}:`, err)
        this.error = 'Failed to load course. Please try again later.'
        
        ElMessage({
          message: 'Failed to load course details',
          type: 'error',
        })
        
        return null
      } finally {
        this.isLoading = false
      }
    },
    searchCourses(query: string) {
      if (!query.trim()) return this.courses
      
      const lowercaseQuery = query.toLowerCase().trim()
      
      return this.courses.filter(course => 
        course.title.toLowerCase().includes(lowercaseQuery) ||
        course.description.toLowerCase().includes(lowercaseQuery) ||
        course.instructor.toLowerCase().includes(lowercaseQuery) ||
        course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    },
    addCourse(course) {
      this.courses.push(course)
    },
    updateCourse(updatedCourse) {
      const index = this.courses.findIndex(course => course.id === updatedCourse.id)
      if (index !== -1) {
        this.courses[index] = updatedCourse
      }
    },
    deleteCourse(id) {
      this.courses = this.courses.filter(course => course.id !== id)
    }
  }
}) 