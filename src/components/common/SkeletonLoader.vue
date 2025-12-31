<script setup lang="ts">
defineProps<{
  type?: 'card' | 'text' | 'circle'
  width?: string
  height?: string
  count?: number
}>()
</script>

<template>
  <div class="skeleton-wrapper">
    <div
      v-for="n in (count || 1)"
      :key="n"
      :class="['skeleton', `skeleton-${type || 'card'}`]"
      :style="{ width: width || '100%', height: height || 'auto' }"
    />
  </div>
</template>

<style lang="scss" scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite;
  border-radius: $border-radius-md;
}

.skeleton-card {
  height: 200px;
  width: 100%;
}

.skeleton-text {
  height: 20px;
  width: 100%;
}

.skeleton-circle {
  border-radius: 50%;
  width: 60px;
  height: 60px;
}
</style>
