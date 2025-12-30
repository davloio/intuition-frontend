<script setup lang="ts">
import { ref } from 'vue'
import { useSearch } from '@/composables/useSearch'

const { search, searching, searchError } = useSearch()
const query = ref('')

const handleSearch = async () => {
  if (query.value.trim()) {
    await search(query.value)
    if (!searchError.value) {
      query.value = ''
    }
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        v-model="query"
        type="text"
        placeholder="Search by block number, transaction hash, block hash, or address..."
        class="search-input"
        @keyup="handleKeyup"
        :disabled="searching"
      />
      <button class="search-button" @click="handleSearch" :disabled="searching || !query.trim()">
        <span v-if="!searching">🔍</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
    <transition name="fade">
      <p v-if="searchError" class="search-error">{{ searchError }}</p>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  display: flex;
  gap: $spacing-sm;
  position: relative;
}

.search-input {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-base;
  background: $color-bg-secondary;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  color: $color-text-primary;
  transition: all 0.3s ease;

  &:focus {
    border-color: $color-border-hover;
    outline: none;
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
  padding: $spacing-sm $spacing-lg;
  background: $color-text-primary;
  border: none;
  border-radius: $border-radius-md;
  color: $color-bg-primary;
  font-size: $font-size-lg;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: $color-secondary;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.search-error {
  color: $color-error;
  font-size: $font-size-sm;
  margin-top: $spacing-sm;
  animation: slideInDown 0.3s ease;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: $color-text-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}
</style>
