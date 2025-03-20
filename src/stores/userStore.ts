import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Define types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface RegistrationData extends UserCredentials {
  firstName: string
  lastName: string
}

// Create store
export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const userData = ref<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    isAdmin: false,
  })
  
  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const fullName = computed(() => {
    if (userData.value.firstName && userData.value.lastName) {
      return `${userData.value.firstName} ${userData.value.lastName}`
    } else if (userData.value.firstName) {
      return userData.value.firstName
    } else {
      return 'User'
    }
  })
  
  // Actions
  /**
   * Login user
   */
  async function login(credentials: { email: string; password: string }) {
    try {
      // In a real application, you would call your API here
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login with demo account
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        // Set token and user data
        const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15)
        token.value = mockToken
        localStorage.setItem('auth_token', mockToken)
        
        // Set user data
        userData.value = {
          firstName: 'Demo',
          lastName: 'User',
          email: credentials.email,
          phone: '+1 (555) 123-4567',
          bio: 'I am a boxing enthusiast looking to improve my skills.',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isAdmin: false,
        }
        
        return true
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      // Handle login error
      console.error('Login error:', error)
      throw error
    }
  }
  
  /**
   * Register new user
   */
  async function register(user: { firstName: string; lastName: string; email: string; password: string }) {
    try {
      // In a real application, you would call your API here
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful registration
      // Set token and user data
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15)
      token.value = mockToken
      localStorage.setItem('auth_token', mockToken)
      
      // Set user data
      userData.value = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '',
        bio: '',
        avatar: '',
        isAdmin: false,
      }
      
      return true
    } catch (error) {
      // Handle registration error
      console.error('Registration error:', error)
      throw error
    }
  }
  
  /**
   * Logout user
   */
  function logout() {
    token.value = null
    localStorage.removeItem('auth_token')
    userData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      avatar: '',
      isAdmin: false,
    }
    
    ElMessage({
      message: 'You have been logged out',
      type: 'success',
    })
  }
  
  /**
   * Update user profile
   */
  async function updateProfile(profile: any) {
    try {
      // In a real application, you would call your API here
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      userData.value = {
        ...userData.value,
        ...profile,
      }
      
      return true
    } catch (error) {
      // Handle profile update error
      console.error('Profile update error:', error)
      throw error
    }
  }
  
  /**
   * Check if user is authenticated
   */
  async function checkAuth() {
    if (!token.value) return false
    
    try {
      // In a real application, you would verify the token with your API
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock user data
      userData.value = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'I am a boxing enthusiast looking to improve my skills.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isAdmin: false,
      }
      
      return true
    } catch (error) {
      // If token is invalid, logout
      console.error('Auth check error:', error)
      logout()
      return false
    }
  }
  
  return {
    token,
    userData,
    isLoggedIn,
    fullName,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  }
}) 