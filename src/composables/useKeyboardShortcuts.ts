import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useKeyboardShortcuts() {
  const router = useRouter()

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    const key = event.key.toLowerCase()
    const ctrlOrCmd = event.ctrlKey || event.metaKey

    if (ctrlOrCmd && key === 'k') {
      event.preventDefault()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      searchInput?.focus()
      return
    }

    if (event.shiftKey) {
      if (key === 'h') {
        event.preventDefault()
        router.push('/')
      } else if (key === 'b') {
        event.preventDefault()
        router.push('/blocks')
      } else if (key === 't') {
        event.preventDefault()
        router.push('/transactions')
      }
    }

    if (key === 'escape') {
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      if (searchInput === document.activeElement) {
        searchInput.blur()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    shortcuts: {
      search: 'Ctrl/Cmd + K',
      home: 'Shift + H',
      blocks: 'Shift + B',
      transactions: 'Shift + T',
      escape: 'Esc to blur search'
    }
  }
}
