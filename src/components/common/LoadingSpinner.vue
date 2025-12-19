<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <div class="loading-spinner" :class="`spinner-${size || 'medium'}`">
    <div class="spinner"></div>
  </div>
</template>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.spinner {
  border: 3px solid transparent;
  border-top-color: $color-primary;
  border-right-color: $color-accent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small .spinner {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner-medium .spinner {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-large .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}
</style>
