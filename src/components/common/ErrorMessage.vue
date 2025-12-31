<script setup lang="ts">
defineProps<{
  message: string
  showIcon?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="error-message">
    <div class="error-content">
      <span
        v-if="showIcon"
        class="error-icon"
      >⚠️</span>
      <p class="error-text">
        {{ message }}
      </p>
    </div>
    <button
      class="error-close"
      aria-label="Close error"
      @click="emit('close')"
    >
      ×
    </button>
  </div>
</template>

<style lang="scss" scoped>
.error-message {
  background: rgba($color-error, 0.1);
  border: 1px solid $color-error;
  border-radius: $border-radius-md;
  padding: $spacing-md $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  margin: $spacing-md 0;
  animation: slideInDown 0.3s ease;
}

.error-content {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
}

.error-icon {
  font-size: $font-size-xl;
}

.error-text {
  color: $color-error;
  margin: 0;
  font-size: $font-size-sm;
}

.error-close {
  background: transparent;
  border: none;
  color: $color-error;
  font-size: $font-size-2xl;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
}
</style>
