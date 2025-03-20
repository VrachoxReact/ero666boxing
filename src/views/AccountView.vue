<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useCourseStore } from '../stores/courseStore'
import { ElMessage, ElTabs, ElTabPane, ElForm, ElFormItem, ElInput, ElButton, ElSwitch, ElUpload, ElDialog } from 'element-plus'
import { ArrowRightIcon, UserCircleIcon, AcademicCapIcon, CogIcon, KeyIcon, CreditCardIcon, BellIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()

const activeTab = ref('profile')
const isLoading = ref(true)
const isSubmitting = ref(false)
const isDialogVisible = ref(false)
const avatarUrl = ref('')

// Password change dialog
const passwordDialog = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// User profile form
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
})

const profileErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

// Notification settings
const notificationSettings = reactive({
  emailNotifications: true,
  courseUpdates: true,
  promotions: false,
  newCourses: true,
})

// Security settings
const securitySettings = reactive({
  twoFactorAuth: false,
  sessionTimeout: '30',
})

// Payment methods
const paymentMethods = ref([
  {
    id: 1,
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
])

// Purchased courses
const purchasedCourses = ref([])

// Computed properties
const userName = computed(() => {
  if (profileForm.firstName && profileForm.lastName) {
    return `${profileForm.firstName} ${profileForm.lastName}`
  } else if (profileForm.firstName) {
    return profileForm.firstName
  } else {
    return 'User'
  }
})

const userInitials = computed(() => {
  if (profileForm.firstName && profileForm.lastName) {
    return `${profileForm.firstName.charAt(0)}${profileForm.lastName.charAt(0)}`
  } else if (profileForm.firstName) {
    return profileForm.firstName.charAt(0)
  } else {
    return 'U'
  }
})

// Load user data
onMounted(async () => {
  // Redirect if not logged in
  if (!userStore.isLoggedIn) {
    localStorage.setItem('redirectAfterLogin', '/account')
    router.push('/auth')
    return
  }

  try {
    // Load user profile data
    const userData = userStore.userData
    
    profileForm.firstName = userData.firstName || ''
    profileForm.lastName = userData.lastName || ''
    profileForm.email = userData.email || ''
    profileForm.phone = userData.phone || ''
    profileForm.bio = userData.bio || ''
    
    // Set avatar if exists
    if (userData.avatar) {
      avatarUrl.value = userData.avatar
    }
    
    // Fetch user's purchased courses
    await fetchPurchasedCourses()
  } catch (error) {
    ElMessage({
      message: 'Failed to load user data',
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
})

// Fetch user's purchased courses
async function fetchPurchasedCourses() {
  try {
    // In a real app, this would come from an API
    // Simulating with local data for now
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get 3 random courses as purchased courses
    const allCourses = courseStore.allCourses
    const randomCourses = [...allCourses].sort(() => 0.5 - Math.random()).slice(0, 3)
    
    // Add completion data to each course
    purchasedCourses.value = randomCourses.map(course => ({
      ...course,
      completionPercentage: Math.floor(Math.random() * 100),
      purchaseDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString(),
    }))
  } catch (error) {
    console.error('Failed to fetch purchased courses', error)
  }
}

// Validate profile form
function validateProfileForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(profileErrors).forEach(key => {
    profileErrors[key as keyof typeof profileErrors] = ''
  })
  
  // First name validation
  if (!profileForm.firstName.trim()) {
    profileErrors.firstName = 'First name is required'
    isValid = false
  }
  
  // Last name validation
  if (!profileForm.lastName.trim()) {
    profileErrors.lastName = 'Last name is required'
    isValid = false
  }
  
  // Email validation
  if (!profileForm.email.trim()) {
    profileErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    profileErrors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  return isValid
}

// Update profile
async function updateProfile() {
  if (!validateProfileForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user data in store
    await userStore.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      bio: profileForm.bio,
      avatar: avatarUrl.value,
    })
    
    ElMessage({
      message: 'Profile updated successfully',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: 'Failed to update profile',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Validate password form
function validatePasswordForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(passwordErrors).forEach(key => {
    passwordErrors[key as keyof typeof passwordErrors] = ''
  })
  
  // Current password validation
  if (!passwordForm.currentPassword.trim()) {
    passwordErrors.currentPassword = 'Current password is required'
    isValid = false
  }
  
  // New password validation
  if (!passwordForm.newPassword.trim()) {
    passwordErrors.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'Password must be at least 8 characters'
    isValid = false
  }
  
  // Confirm password validation
  if (!passwordForm.confirmPassword.trim()) {
    passwordErrors.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

// Change password
async function changePassword() {
  if (!validatePasswordForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would call an API to change the password
    
    ElMessage({
      message: 'Password changed successfully',
      type: 'success',
    })
    
    // Close dialog and reset form
    passwordDialog.value = false
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage({
      message: 'Failed to change password',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Update notification settings
async function updateNotificationSettings() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real app, you would call an API to update notification settings
    
    ElMessage({
      message: 'Notification settings updated',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: 'Failed to update notification settings',
      type: 'error',
    })
  }
}

// Update security settings
async function updateSecuritySettings() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real app, you would call an API to update security settings
    
    ElMessage({
      message: 'Security settings updated',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: 'Failed to update security settings',
      type: 'error',
    })
  }
}

// Handle avatar upload
function handleAvatarSuccess(response: any) {
  // In a real app, this would get the URL from the upload response
  avatarUrl.value = URL.createObjectURL(response.raw)
}

// Delete account
function confirmDeleteAccount() {
  isDialogVisible.value = true
}

async function deleteAccount() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Logout user
    await userStore.logout()
    
    ElMessage({
      message: 'Your account has been deleted',
      type: 'success',
    })
    
    // Redirect to home page
    router.push('/')
  } catch (error) {
    ElMessage({
      message: 'Failed to delete account',
      type: 'error',
    })
  } finally {
    isDialogVisible.value = false
  }
}

// Continue a course
function continueCourse(courseId: number) {
  router.push(`/courses/${courseId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex h-96 items-center justify-center">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
      
      <div v-else>
        <!-- Account Header -->
        <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="flex items-center">
            <div v-if="avatarUrl" class="mr-4 h-16 w-16 overflow-hidden rounded-full">
              <img :src="avatarUrl" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
              <span class="text-xl font-bold">{{ userInitials }}</span>
            </div>
            
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userName }}'s Account</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Member since {{ new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
              </p>
            </div>
          </div>
          
          <button @click="userStore.logout(); router.push('/')" class="btn btn-outline">
            Sign Out
          </button>
        </div>
        
        <!-- Account Tabs -->
        <div class="rounded-lg bg-white shadow-md dark:bg-gray-800">
          <ElTabs v-model="activeTab" class="account-tabs">
            <!-- Profile Tab -->
            <ElTabPane label="Profile" name="profile">
              <div class="p-6">
                <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
                
                <ElForm :model="profileForm" class="space-y-6">
                  <!-- Avatar Upload -->
                  <div class="flex items-start space-x-4">
                    <div v-if="avatarUrl" class="h-20 w-20 overflow-hidden rounded-full">
                      <img :src="avatarUrl" alt="Profile" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <UserCircleIcon class="h-12 w-12 text-gray-400" />
                    </div>
                    
                    <div>
                      <ElUpload
                        class="avatar-uploader"
                        action="#"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                      >
                        <ElButton>Change Avatar</ElButton>
                      </ElUpload>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG or GIF. 1MB max.
                      </p>
                    </div>
                  </div>
                  
                  <!-- Name Fields -->
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ElFormItem :error="profileErrors.firstName">
                      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                      </label>
                      <ElInput v-model="profileForm.firstName" placeholder="First Name" />
                    </ElFormItem>
                    
                    <ElFormItem :error="profileErrors.lastName">
                      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                      </label>
                      <ElInput v-model="profileForm.lastName" placeholder="Last Name" />
                    </ElFormItem>
                  </div>
                  
                  <!-- Contact Fields -->
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ElFormItem :error="profileErrors.email">
                      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <ElInput v-model="profileForm.email" type="email" placeholder="Email Address" />
                    </ElFormItem>
                    
                    <ElFormItem :error="profileErrors.phone">
                      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <ElInput v-model="profileForm.phone" placeholder="Phone Number" />
                    </ElFormItem>
                  </div>
                  
                  <!-- Bio Field -->
                  <ElFormItem>
                    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <ElInput
                      v-model="profileForm.bio"
                      type="textarea"
                      :rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </ElFormItem>
                  
                  <!-- Submit Button -->
                  <div class="flex justify-end">
                    <ElButton
                      type="primary"
                      @click="updateProfile"
                      :loading="isSubmitting"
                    >
                      Save Changes
                    </ElButton>
                  </div>
                </ElForm>
                
                <!-- Change Password -->
                <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Password</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <ElButton @click="passwordDialog = true">Change Password</ElButton>
                  </div>
                </div>
                
                <!-- Delete Account -->
                <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-red-600">Delete Account</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <ElButton type="danger" @click="confirmDeleteAccount">Delete Account</ElButton>
                  </div>
                </div>
              </div>
            </ElTabPane>
            
            <!-- Courses Tab -->
            <ElTabPane label="My Courses" name="courses">
              <div class="p-6">
                <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                
                <div v-if="purchasedCourses.length === 0" class="flex flex-col items-center justify-center py-12">
                  <AcademicCapIcon class="h-16 w-16 text-gray-400" />
                  <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No courses yet</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You haven't purchased any courses yet
                  </p>
                  <ElButton class="mt-4" @click="router.push('/courses')">Browse Courses</ElButton>
                </div>
                
                <div v-else class="space-y-4">
                  <div
                    v-for="course in purchasedCourses"
                    :key="course.id"
                    class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div class="flex flex-col sm:flex-row">
                      <div class="h-48 w-full sm:h-auto sm:w-48">
                        <img :src="course.image" :alt="course.title" class="h-full w-full object-cover" />
                      </div>
                      
                      <div class="flex flex-1 flex-col p-4">
                        <div class="mb-4 flex-1">
                          <div class="flex justify-between">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ course.title }}</h3>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Purchased: {{ course.purchaseDate }}</span>
                          </div>
                          
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Last accessed: {{ course.lastAccessed }}
                          </p>
                          
                          <div class="mt-4">
                            <div class="flex items-center justify-between">
                              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Progress: {{ course.completionPercentage }}%
                              </span>
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                {{ Math.round(course.completionPercentage / 100 * course.totalLessons) }} / {{ course.totalLessons }} lessons
                              </span>
                            </div>
                            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                class="h-2 rounded-full bg-primary"
                                :style="{ width: `${course.completionPercentage}%` }"
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="flex justify-end">
                          <ElButton
                            type="primary"
                            @click="continueCourse(course.id)"
                            class="flex items-center"
                          >
                            {{ course.completionPercentage > 0 ? 'Continue' : 'Start' }} Course
                            <ArrowRightIcon class="ml-1 h-4 w-4" />
                          </ElButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-8 flex justify-center">
                  <ElButton @click="router.push('/courses')">Browse More Courses</ElButton>
                </div>
              </div>
            </ElTabPane>
            
            <!-- Settings Tab -->
            <ElTabPane label="Settings" name="settings">
              <div class="p-6">
                <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
                
                <!-- Notification Settings -->
                <div class="mb-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div class="mb-4 flex items-center">
                    <BellIcon class="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Receive emails for account updates and important notifications
                        </p>
                      </div>
                      <ElSwitch v-model="notificationSettings.emailNotifications" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Course Updates</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Get notified when your enrolled courses have new content
                        </p>
                      </div>
                      <ElSwitch v-model="notificationSettings.courseUpdates" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Promotional Emails</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Receive offers, discounts, and promotional content
                        </p>
                      </div>
                      <ElSwitch v-model="notificationSettings.promotions" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">New Course Announcements</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Get notified when new courses are available
                        </p>
                      </div>
                      <ElSwitch v-model="notificationSettings.newCourses" />
                    </div>
                  </div>
                  
                  <div class="mt-4 flex justify-end">
                    <ElButton @click="updateNotificationSettings">Save Preferences</ElButton>
                  </div>
                </div>
                
                <!-- Security Settings -->
                <div class="mb-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div class="mb-4 flex items-center">
                    <ShieldCheckIcon class="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <ElSwitch v-model="securitySettings.twoFactorAuth" />
                    </div>
                    
                    <div>
                      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout</p>
                      <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        How long to keep you logged in when inactive
                      </p>
                      <ElSelect v-model="securitySettings.sessionTimeout" class="w-full">
                        <el-option label="15 minutes" value="15" />
                        <el-option label="30 minutes" value="30" />
                        <el-option label="1 hour" value="60" />
                        <el-option label="4 hours" value="240" />
                        <el-option label="1 day" value="1440" />
                      </ElSelect>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex justify-end">
                    <ElButton @click="updateSecuritySettings">Save Settings</ElButton>
                  </div>
                </div>
                
                <!-- Payment Methods -->
                <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div class="mb-4 flex items-center">
                    <CreditCardIcon class="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Payment Methods</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <div v-for="method in paymentMethods" :key="method.id" class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div class="flex items-center">
                        <div class="mr-3 h-10 w-14 rounded bg-blue-100 p-2 dark:bg-blue-900">
                          <div v-if="method.type === 'visa'" class="text-blue-700 dark:text-blue-400">
                            VISA
                          </div>
                          <div v-else-if="method.type === 'mastercard'" class="text-red-600">
                            MC
                          </div>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            •••• •••• •••• {{ method.last4 }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Expires {{ method.expiry }}
                            <span v-if="method.isDefault" class="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              Default
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button class="text-sm text-primary hover:underline">Edit</button>
                        <button class="text-sm text-red-600 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex justify-end">
                    <ElButton>Add Payment Method</ElButton>
                  </div>
                </div>
              </div>
            </ElTabPane>
          </ElTabs>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Change Password Dialog -->
  <ElDialog v-model="passwordDialog" title="Change Password" width="500px">
    <ElForm :model="passwordForm">
      <ElFormItem :error="passwordErrors.currentPassword">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Password
        </label>
        <ElInput
          v-model="passwordForm.currentPassword"
          type="password"
          placeholder="Enter your current password"
        />
      </ElFormItem>
      
      <ElFormItem :error="passwordErrors.newPassword">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          New Password
        </label>
        <ElInput
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="Enter your new password"
          show-password
        />
      </ElFormItem>
      
      <ElFormItem :error="passwordErrors.confirmPassword">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm New Password
        </label>
        <ElInput
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          show-password
        />
      </ElFormItem>
    </ElForm>
    
    <template #footer>
      <div class="flex justify-end space-x-2">
        <ElButton @click="passwordDialog = false">Cancel</ElButton>
        <ElButton
          type="primary"
          @click="changePassword"
          :loading="isSubmitting"
        >
          Change Password
        </ElButton>
      </div>
    </template>
  </ElDialog>
  
  <!-- Delete Account Confirmation Dialog -->
  <ElDialog v-model="isDialogVisible" title="Delete Account" width="500px">
    <div class="text-center">
      <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </div>
      
      <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Are you sure?</h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        This action cannot be undone. All your data, including purchased courses and progress, will be permanently deleted.
      </p>
      
      <div class="flex justify-center space-x-4">
        <ElButton @click="isDialogVisible = false">Cancel</ElButton>
        <ElButton type="danger" @click="deleteAccount">Delete Account</ElButton>
      </div>
    </div>
  </ElDialog>
</template>

<style scoped>
/* Custom styles for the account tabs */
:deep(.el-tabs__item) {
  font-size: 1rem;
  height: 60px;
  line-height: 60px;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  background-color: var(--el-color-primary);
}

/* Avatar uploader */
:deep(.avatar-uploader .el-upload) {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}
</style> 