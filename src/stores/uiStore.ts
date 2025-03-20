import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

// Create store
export const useUiStore = defineStore('ui', () => {
  // Get system preference
  const prefersDark = usePreferredDark()
  
  // State
  const isDarkMode = ref(false)
  const isNavbarOpen = ref(false)
  const isMobileMenuOpen = ref(false)
  
  // Getters
  const darkMode = computed(() => isDarkMode.value)
  
  // Actions
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    applyDarkMode()
    saveDarkModePreference()
  }
  
  function enableDarkMode() {
    isDarkMode.value = true
    applyDarkMode()
    saveDarkModePreference()
  }
  
  function disableDarkMode() {
    isDarkMode.value = false
    applyDarkMode()
    saveDarkModePreference()
  }
  
  function applyDarkMode() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function saveDarkModePreference() {
    localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light')
  }
  
  function toggleNavbar() {
    isNavbarOpen.value = !isNavbarOpen.value
    
    if (isNavbarOpen.value) {
      // Close mobile menu if navbar is open
      isMobileMenuOpen.value = false
    }
  }
  
  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }
  
  // Initialize dark mode
  function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode')
    
    if (savedMode) {
      isDarkMode.value = savedMode === 'dark'
    } else {
      // Use system preference if no saved preference
      isDarkMode.value = prefersDark.value
    }
    
    applyDarkMode()
  }
  
  // Watch for system preference changes
  watch(prefersDark, (newValue) => {
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = newValue
      applyDarkMode()
    }
  })

  // Initialize
  loadDarkModePreference()

  return {
    isDarkMode,
    isNavbarOpen,
    isMobileMenuOpen,
    darkMode,
    toggleDarkMode,
    enableDarkMode,
    disableDarkMode,
    toggleNavbar,
    toggleMobileMenu,
    closeMobileMenu
  }
}) 