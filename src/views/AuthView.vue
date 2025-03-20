<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { AtSymbolIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElTabs, ElTabPane, ElDivider } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('login')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)
const isSubmitting = ref(false)

// Get active tab from route
onMounted(() => {
  const tab = route.params.tab as string
  if (tab === 'register') {
    activeTab.value = 'register'
  }
  
  // Check for redirect after login
  const redirectPath = localStorage.getItem('redirectAfterLogin')
  if (redirectPath) {
    redirectUrl.value = redirectPath
  }
})

// Login form data
const loginForm = reactive({
  email: '',
  password: '',
})

// Registration form data
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

// Validation for login form
const loginErrors = reactive({
  email: '',
  password: '',
})

// Validation for registration form
const registerErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: '',
})

// Redirect URL after login
const redirectUrl = ref('/account')

// Form validation
const validateLoginForm = () => {
  let isValid = true
  
  // Reset errors
  loginErrors.email = ''
  loginErrors.password = ''
  
  // Email validation
  if (!loginForm.email) {
    loginErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
    loginErrors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Password validation
  if (!loginForm.password) {
    loginErrors.password = 'Password is required'
    isValid = false
  }
  
  return isValid
}

const validateRegisterForm = () => {
  let isValid = true
  
  // Reset errors
  registerErrors.firstName = ''
  registerErrors.lastName = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  registerErrors.agreeToTerms = ''
  
  // First name validation
  if (!registerForm.firstName) {
    registerErrors.firstName = 'First name is required'
    isValid = false
  }
  
  // Last name validation
  if (!registerForm.lastName) {
    registerErrors.lastName = 'Last name is required'
    isValid = false
  }
  
  // Email validation
  if (!registerForm.email) {
    registerErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Password validation
  if (!registerForm.password) {
    registerErrors.password = 'Password is required'
    isValid = false
  } else if (registerForm.password.length < 8) {
    registerErrors.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  // Confirm password validation
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  // Terms agreement validation
  if (!registerForm.agreeToTerms) {
    registerErrors.agreeToTerms = 'You must agree to the terms and conditions'
    isValid = false
  }
  
  return isValid
}

// Computed properties for form validation
const isLoginFormValid = computed(() => {
  return loginForm.email && loginForm.password
})

const isRegisterFormValid = computed(() => {
  return registerForm.firstName && 
         registerForm.lastName && 
         registerForm.email && 
         registerForm.password && 
         registerForm.confirmPassword && 
         registerForm.agreeToTerms
})

// Handle login form submission
const handleLogin = async () => {
  if (!validateLoginForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Login user (in a real app, this would call a backend API)
    await userStore.login({
      email: loginForm.email,
      password: loginForm.password,
    })
    
    ElMessage({
      message: 'Successfully logged in!',
      type: 'success',
    })
    
    // Redirect to the appropriate page
    const redirectTo = localStorage.getItem('redirectAfterLogin') || '/account'
    localStorage.removeItem('redirectAfterLogin')
    router.push(redirectTo)
  } catch (error) {
    ElMessage({
      message: 'Invalid email or password',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Handle registration form submission
const handleRegister = async () => {
  if (!validateRegisterForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Register user (in a real app, this would call a backend API)
    await userStore.register({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password,
    })
    
    ElMessage({
      message: 'Account created successfully! You can now log in.',
      type: 'success',
    })
    
    // Switch to login tab
    activeTab.value = 'login'
    
    // Pre-fill login form with registered email
    loginForm.email = registerForm.email
    loginForm.password = ''
  } catch (error) {
    ElMessage({
      message: 'Registration failed. Please try again.',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Handle social login
const handleSocialLogin = (provider: string) => {
  ElMessage({
    message: `${provider} login is not implemented in this demo`,
    type: 'info',
  })
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <div class="bg-gray-50 py-16 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-md">
        <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <!-- Tabs -->
          <ElTabs v-model="activeTab" class="auth-tabs">
            <ElTabPane label="Login" name="login">
              <div class="p-6">
                <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Sign in to access your account
                </p>
                
                <!-- Login Form -->
                <div class="mt-8">
                  <ElForm
                    :model="loginForm"
                    @submit.native.prevent="handleLogin"
                  >
                    <ElFormItem
                      prop="email"
                      :error="loginErrors.email"
                    >
                      <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <AtSymbolIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <ElInput
                          v-model="loginForm.email"
                          type="email"
                          placeholder="Email address"
                          class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </ElFormItem>
                    
                    <ElFormItem
                      prop="password"
                      :error="loginErrors.password"
                      class="mt-4"
                    >
                      <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <ElInput
                          v-model="loginForm.password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Password"
                          class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <div class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3" @click="togglePasswordVisibility">
                          <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        </div>
                      </div>
                    </ElFormItem>
                    
                    <div class="mt-4 flex items-center justify-between">
                      <ElCheckbox v-model="rememberMe">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                      </ElCheckbox>
                      
                      <div>
                        <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
                      </div>
                    </div>
                    
                    <div class="mt-6">
                      <button
                        type="submit"
                        class="btn btn-primary w-full"
                        :disabled="!isLoginFormValid || isSubmitting"
                      >
                        <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
                        {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
                      </button>
                    </div>
                  </ElForm>
                </div>
                
                <!-- Social Login -->
                <div class="mt-8">
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="bg-white px-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <div>
                      <button
                        @click="handleSocialLogin('Google')"
                        class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        <span class="ml-2">Google</span>
                      </button>
                    </div>
                    
                    <div>
                      <button
                        @click="handleSocialLogin('Facebook')"
                        class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span class="ml-2">Facebook</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Register Link -->
                <div class="mt-8 text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?
                    <a @click="activeTab = 'register'" class="cursor-pointer text-primary hover:underline">
                      Register now
                    </a>
                  </p>
                </div>
              </div>
            </ElTabPane>
            
            <ElTabPane label="Register" name="register">
              <div class="p-6">
                <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">
                  Create an Account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Sign up to get started with our boxing courses
                </p>
                
                <!-- Registration Form -->
                <div class="mt-8">
                  <ElForm
                    :model="registerForm"
                    @submit.native.prevent="handleRegister"
                  >
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ElFormItem
                        prop="firstName"
                        :error="registerErrors.firstName"
                      >
                        <div class="relative">
                          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon class="h-5 w-5 text-gray-400" />
                          </div>
                          <ElInput
                            v-model="registerForm.firstName"
                            placeholder="First Name"
                            class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </ElFormItem>
                      
                      <ElFormItem
                        prop="lastName"
                        :error="registerErrors.lastName"
                      >
                        <div class="relative">
                          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon class="h-5 w-5 text-gray-400" />
                          </div>
                          <ElInput
                            v-model="registerForm.lastName"
                            placeholder="Last Name"
                            class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </ElFormItem>
                    </div>
                    
                    <ElFormItem
                      prop="email"
                      :error="registerErrors.email"
                      class="mt-4"
                    >
                      <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <AtSymbolIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <ElInput
                          v-model="registerForm.email"
                          type="email"
                          placeholder="Email address"
                          class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </ElFormItem>
                    
                    <ElFormItem
                      prop="password"
                      :error="registerErrors.password"
                      class="mt-4"
                    >
                      <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <ElInput
                          v-model="registerForm.password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Password"
                          class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <div class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3" @click="togglePasswordVisibility">
                          <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        </div>
                      </div>
                    </ElFormItem>
                    
                    <ElFormItem
                      prop="confirmPassword"
                      :error="registerErrors.confirmPassword"
                      class="mt-4"
                    >
                      <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <ElInput
                          v-model="registerForm.confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          placeholder="Confirm Password"
                          class="block w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <div class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3" @click="toggleConfirmPasswordVisibility">
                          <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        </div>
                      </div>
                    </ElFormItem>
                    
                    <ElFormItem
                      prop="agreeToTerms"
                      :error="registerErrors.agreeToTerms"
                      class="mt-4"
                    >
                      <div class="flex items-start">
                        <ElCheckbox v-model="registerForm.agreeToTerms">
                          <span class="text-sm text-gray-600 dark:text-gray-400">
                            I agree to the 
                            <a href="#" class="text-primary hover:underline">Terms of Service</a> 
                            and 
                            <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                          </span>
                        </ElCheckbox>
                      </div>
                    </ElFormItem>
                    
                    <div class="mt-6">
                      <button
                        type="submit"
                        class="btn btn-primary w-full"
                        :disabled="!isRegisterFormValid || isSubmitting"
                      >
                        <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
                        {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
                      </button>
                    </div>
                  </ElForm>
                </div>
                
                <!-- Login Link -->
                <div class="mt-8 text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?
                    <a @click="activeTab = 'login'" class="cursor-pointer text-primary hover:underline">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </ElTabPane>
          </ElTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the auth tabs */
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
</style> 