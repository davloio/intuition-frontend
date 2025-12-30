import { ref, watch, onMounted } from 'vue'

type Theme = 'dark' | 'light'

const THEME_KEY = 'intuition-theme'

const currentTheme = ref<Theme>('dark')

export function useTheme() {
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null
    const preferredTheme = savedTheme || 'dark'
    setTheme(preferredTheme)
  }

  onMounted(() => {
    initTheme()
  })

  watch(currentTheme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  })

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    initTheme
  }
}
