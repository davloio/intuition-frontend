<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Block } from '@/types/block'
import { formatNumber } from '@/utils/formatters'
import { format } from 'date-fns'

defineProps<{
  block: Block
}>()

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return format(date, 'PPpp')
}

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)
  return format(date, 'PPpp')
}
</script>

<template>
  <RouterLink
    :to="`/blocks/${block.number}`"
    class="block-card border-gradient glass-card"
  >
    <div class="card-header">
      <span class="card-code">BLK</span>
      <span class="card-number">{{ formatNumber(block.number) }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Block Number</span>
      <span class="card-value mono">{{ formatNumber(block.number) }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Transactions</span>
      <span class="card-value mono">{{ block.transactionCount }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Timestamp</span>
      <span class="card-value mono text-xs">{{ formatTimestamp(block.timestamp) }}</span>
    </div>

    <div class="card-footer">
      <span class="card-timestamp">Indexed: {{ formatCreatedAt(block.createdAt) }}</span>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.block-card {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  text-decoration: none;
  color: $color-text-primary;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  transition: transform 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);

    &::after {
      opacity: 1;
    }
  }

  [data-theme="light"] & {
    &::after {
      background: rgba(0, 0, 0, 0.03);
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.card-number {
  font-size: $font-size-lg;
  font-weight: 600;
  font-family: $font-family-mono;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-sm;
}

.card-label {
  color: $color-text-secondary;
  font-weight: 500;
  font-size: $font-size-xs;
}

.card-value {
  color: $color-text-primary;
  font-weight: 500;
  
  &.text-xs {
    font-size: 10px;
  }
}

.card-footer {
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
}

.card-timestamp {
  color: $color-text-muted;
  font-size: 10px;
  font-family: $font-family-mono;
}
</style>
