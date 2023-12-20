import { defineStore } from "pinia";
import { ref, computed } from 'vue'
export const useAuth = defineStore(
  'auth',
  () => {
    const token = ref(localStorage.getItem('token') || '')
    const expires = ref(localStorage.getItem('token') || '')
    const scope = ref(localStorage.getItem('token') || '')

    const isLoggedIn = computed(() => {
      return token.value !== ''
    })

    const isAdmin = computed(() => {
      return scope.value === 'admin'
    })

    return { token, expires, scope, isLoggedIn, isAdmin }
  })
