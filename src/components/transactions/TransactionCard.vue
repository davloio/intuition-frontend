<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Transaction } from '@/types/transaction'
import { format } from 'date-fns'

defineProps<{
  transaction: Transaction
}>()

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)
  return format(date, 'PPpp')
}
</script>

<template>
  <RouterLink
    :to="`/transactions/${transaction.hash}`"
    class="transaction-card border-gradient glass-card"
  >
    <div class="card-header">
      <span class="card-code">TXN</span>
      <span class="position-badge"> Pos. {{ transaction.position }} </span>
    </div>

    <div class="card-row">
      <span class="card-label">Hash</span>
      <span class="mono text-truncate">{{ transaction.hash.substring(0, 16) }}...</span>
    </div>

    <div class="card-row">
      <span class="card-label">Block Number</span>
      <span class="card-value mono">{{ transaction.blockNumber }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Position</span>
      <span class="card-value mono">{{ transaction.position }}</span>
    </div>

    <div class="card-footer">
      <span class="card-timestamp">{{ formatCreatedAt(transaction.createdAt) }}</span>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.transaction-card {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  text-decoration: none;
  color: $color-text-primary;
  cursor: pointer;
  border-radius: $border-radius-lg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $border-radius-lg;
    background: $color-hover-overlay;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
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

.position-badge {
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 600;
  font-family: $font-family-mono;
  letter-spacing: 0.1em;
  background: transparent;
  color: $color-text-secondary;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
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
