<template>
  <div
    class="copyable-value"
    :class="{ inline, clickable: !disableClick }"
  >
    <span
      class="value"
      :class="valueClass"
      @click="handleValueClick"
    >
      <slot>{{ displayText }}</slot>
    </span>
    <CopyIcon
      v-if="!hideIcon"
      :value="value"
      :copied="copied"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCopyToClipboard } from '@/composables/use-copy-to-clipboard';
import CopyIcon from './CopyIcon.vue';

const props = withDefaults(
  defineProps<{
    value: string;
    displayValue?: string;
    inline?: boolean;
    hideIcon?: boolean;
    disableClick?: boolean;
    valueClass?: string;
  }>(),
  {
    displayValue: undefined,
    inline: false,
    hideIcon: false,
    disableClick: false,
    valueClass: '',
  }
);

const { copied, copyToClipboard } = useCopyToClipboard();

const displayText = computed(() => props.displayValue || props.value);

const handleCopy = async () => {
  await copyToClipboard(props.value);
};

const handleValueClick = () => {
  if (!props.disableClick) {
    handleCopy();
  }
};
</script>

<style lang="scss" scoped>
.copyable-value {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  width: 100%;

  &.inline {
    display: inline-flex;
    width: auto;
  }

  &.clickable .value {
    cursor: pointer;
    transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      color: $color-text-primary;
    }
  }

  .value {
    flex: 1;
    min-width: 0;
    word-break: break-all;
  }
}
</style>
