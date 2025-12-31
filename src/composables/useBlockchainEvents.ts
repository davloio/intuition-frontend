import { ref } from 'vue'

const newBlockEvent = ref<number>(0)

export const useBlockchainEvents = () => {
  const triggerNewBlockEvent = () => {
    newBlockEvent.value++
  }

  return {
    newBlockEvent,
    triggerNewBlockEvent
  }
}
