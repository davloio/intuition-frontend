<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSearch } from '@/composables/useSearch'

const emit = defineEmits<{
  close: []
}>()

const { search, searching, searchError } = useSearch()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const handleSearch = async () => {
  if (query.value.trim()) {
    await search(query.value)
    if (!searchError.value) {
      query.value = ''
      emit('close')
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  } else if (event.key === 'Escape') {
    emit('close')
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

onMounted(() => {
  inputRef.value?.focus()
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

watch(searchError, (error) => {
  if (error) {
    setTimeout(() => {
      searchError.value = null
    }, 3000)
  }
})
</script>

<template>
  <div class="search-modal-backdrop" @click="handleBackdropClick">
    <div class="search-wrapper">
      <div class="search-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Search by block number, hash, or transaction hash..."
        class="search-input"
        @keydown="handleKeydown"
        :disabled="searching"
      />
      <button 
        class="search-button" 
        @click="handleSearch" 
        :disabled="searching || !query.trim()"
        aria-label="Search"
      >
        <svg v-if="!searching" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div v-else class="loading-spinner"></div>
      </button>
      <button class="close-button" @click="emit('close')" aria-label="Close search">
        <span class="close-icon">×</span>
      </button>
      
      <transition name="fade">
        <div v-if="searchError" class="search-error">
          {{ searchError }}
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20vh $spacing-md $spacing-md;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.search-wrapper {
  width: 100%;
  max-width: 640px;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(60px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(60px) saturate(180%) brightness(1.05);
  border-radius: 100px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 1px 2px rgba(255, 255, 255, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.15),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  animation: slideInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 100px;
    padding: 1px;
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.0) 100%
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.search-icon {
  flex-shrink: 0;
  color: $color-text-muted;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  flex: 1;
  background: none !important;
  border: none !important;
  outline: none !important;
  color: $color-text-primary;
  font-size: $font-size-base;
  font-family: $font-family-primary;
  font-weight: 400;
  padding: 0 !important;
  margin: 0;
  border-radius: 0 !important;
  box-shadow: none !important;

  &:focus {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  &::placeholder {
    color: $color-text-muted;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.search-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  border-radius: 50%;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: $color-text-primary;
  }

  &:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: $color-text-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.close-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  border-radius: 50%;
  color: $color-text-muted;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  padding: 0;
  margin: 0;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $color-text-primary;
  }

  &:active {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    border: none;
  }
}

.close-icon {
  font-size: 24px;
  line-height: 1;
  display: block;
  pointer-events: none;
}

.search-error {
  position: absolute;
  top: calc(100% + $spacing-sm);
  left: $spacing-lg;
  right: $spacing-lg;
  color: $color-error;
  font-size: $font-size-sm;
  background: rgba(239, 68, 68, 0.1);
  padding: $spacing-xs $spacing-md;
  border-radius: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
