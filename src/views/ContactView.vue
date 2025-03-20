<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'

// Form data
const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

// Contact info
const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: 'Email Us',
    description: 'Send us an email and we\'ll get back to you within 24 hours.',
    content: 'support@erikkuresevi.com',
    link: 'mailto:support@erikkuresevi.com',
  },
  {
    icon: PhoneIcon,
    title: 'Call Us',
    description: 'Feel free to call us during our business hours.',
    content: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: MapPinIcon,
    title: 'Our Location',
    description: 'Visit our training facility in person.',
    content: '123 Boxing Street, New York, NY 10001',
    link: 'https://maps.google.com/?q=123+Boxing+Street,New+York,NY+10001',
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    description: 'We\'re available Monday-Friday.',
    content: '9:00 AM - 6:00 PM EST',
    link: null,
  },
]

// Subject options
const subjectOptions = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Course Question', label: 'Question about a Course' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Billing Issue', label: 'Billing Issue' },
  { value: 'Partnership', label: 'Partnership Opportunity' },
  { value: 'Other', label: 'Other' },
]

// Validation
const validateForm = () => {
  // Simple validation - check if required fields are filled
  if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
    ElMessage({
      message: 'Please fill in all required fields',
      type: 'error',
    })
    return false
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(contactForm.email)) {
    ElMessage({
      message: 'Please enter a valid email address',
      type: 'error',
    })
    return false
  }
  
  return true
}

// Submit form
const submitForm = () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  // Simulate form submission
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    
    ElMessage({
      message: 'Your message has been sent! We\'ll get back to you soon.',
      type: 'success',
    })
    
    // Reset form
    contactForm.name = ''
    contactForm.email = ''
    contactForm.phone = ''
    contactForm.subject = ''
    contactForm.message = ''
    
    // Reset submission state after a while
    setTimeout(() => {
      isSubmitted.value = false
    }, 5000)
  }, 1500)
}

// FAQ items
const faqItems = [
  {
    question: 'Do I need prior boxing experience to take your courses?',
    answer: 'No, our courses are designed for all skill levels. We have beginner courses that start with the fundamentals and gradually progress to more advanced techniques. Each course clearly indicates the recommended skill level.'
  },
  {
    question: 'What equipment do I need to follow along with the courses?',
    answer: 'For beginners, you can start with just hand wraps and boxing gloves. As you progress, you might want to add a heavy bag, speed bag, and other equipment. Each course includes a recommended equipment list at the beginning.'
  },
  {
    question: 'How long do I have access to the courses after purchasing?',
    answer: 'Once you purchase a course, you have lifetime access to all course materials. You can revisit lessons as often as you need and progress at your own pace.'
  },
  {
    question: 'Can I download the videos to watch offline?',
    answer: 'Yes, all course videos are downloadable so you can practice without an internet connection. This is perfect for training at the gym or when traveling.'
  },
  {
    question: "Do you offer refunds if I'm not satisfied with a course?",
    answer: "We offer a 30-day money-back guarantee on all our courses. If you're not completely satisfied, contact our support team within 30 days of purchase for a full refund."
  },
  {
    question: 'Is there any support available if I have questions about the training?',
    answer: 'Absolutely! Each course includes access to a dedicated Q&A section where you can ask questions and get responses from our coaches. We also offer email support for any technical or billing issues.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-900 py-24 text-white">
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://placehold.co/1920x1080.webp?text=Contact+Hero" 
          alt="Boxing Gym" 
          class="h-full w-full object-cover opacity-20"
        />
      </div>
      <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold sm:text-5xl md:text-6xl">
            Get In Touch
          </h1>
          <p class="mt-6 text-xl text-gray-300">
            Have questions about our courses? We're here to help you on your boxing journey.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Contact Info Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div 
            v-for="(item, index) in contactInfo" 
            :key="index" 
            class="rounded-lg bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800"
          >
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <component :is="item.icon" class="h-6 w-6 text-primary" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
            <div class="mt-4">
              <a 
                v-if="item.link" 
                :href="item.link" 
                class="font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.content }}
              </a>
              <span v-else class="font-medium text-gray-700 dark:text-gray-300">{{ item.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Contact Form Section -->
    <section class="bg-gray-50 py-16 dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div class="p-6 sm:p-8">
              <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Send Us a Message</h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <div class="mt-8">
                <ElForm :model="contactForm" label-position="top">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <ElFormItem label="Your Name" required>
                      <ElInput v-model="contactForm.name" placeholder="Your full name" />
                    </ElFormItem>
                    
                    <ElFormItem label="Email Address" required>
                      <ElInput v-model="contactForm.email" placeholder="Your email address" type="email" />
                    </ElFormItem>
                    
                    <ElFormItem label="Phone Number" optional>
                      <ElInput v-model="contactForm.phone" placeholder="Your phone number (optional)" />
                    </ElFormItem>
                    
                    <ElFormItem label="Subject" required>
                      <ElSelect v-model="contactForm.subject" placeholder="Select a subject" class="w-full">
                        <ElOption
                          v-for="option in subjectOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                    
                    <ElFormItem label="Message" required class="sm:col-span-2">
                      <ElInput
                        v-model="contactForm.message"
                        type="textarea"
                        :rows="6"
                        placeholder="Your message"
                        resize="none"
                      />
                    </ElFormItem>
                  </div>
                  
                  <div class="mt-6 text-right">
                    <ElButton 
                      type="primary" 
                      @click="submitForm" 
                      :loading="isSubmitting"
                      class="h-11 w-full bg-primary hover:bg-primary-600 sm:w-auto"
                    >
                      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                    </ElButton>
                  </div>
                  
                  <div v-if="isSubmitted" class="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-green-800 dark:text-green-200">
                          Your message has been sent! We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </ElForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about our boxing courses
          </p>
        </div>
        
        <div class="mt-12 mx-auto max-w-3xl">
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="(item, index) in faqItems" 
              :key="index"
              class="py-6"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ item.question }}
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Still have questions? Contact us directly at 
            <a href="mailto:support@erikkuresevi.com" class="font-medium text-primary hover:underline">
              support@erikkuresevi.com
            </a>
          </p>
        </div>
      </div>
    </section>
    
    <!-- Map Section -->
    <section class="relative h-96">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1649091176562!5m2!1sen!2sca" 
        class="absolute inset-0 h-full w-full border-0" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
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
          <router-link to="/about" class="btn border border-white bg-transparent text-white hover:bg-white/10">
            Learn About Us
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template> 