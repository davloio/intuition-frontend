<template>
  <button
    class="copy-icon"
    :class="{ copied }"
    @click.stop="$emit('copy')"
    :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
  >
    <svg
      v-if="!copied"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <svg
      v-else
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  copied: boolean;
}>();

defineEmits<{
  copy: [];
}>();
</script>

<style lang="scss" scoped>
.copy-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xs;
  background: transparent;
  border: none;
  color: $color-text-muted;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: $color-text-primary;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  &:active {
    transform: scale(0.95);
  }

  &.copied {
    color: $color-text-primary;

    svg {
      animation: checkmark 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  svg {
    display: block;
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>
