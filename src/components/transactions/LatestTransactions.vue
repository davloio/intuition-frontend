<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useTransactions, useTransactionsSubscription } from '@/composables/useTransactions'
import { truncateHash, formatTimeAgo } from '@/utils/formatters'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useBlockchainEvents } from '@/composables/useBlockchainEvents'

const { transactions, loading } = useTransactions(10, 0)
const { latestTransaction } = useTransactionsSubscription()
const { newBlockEvent } = useBlockchainEvents()
const displayedTransactions = ref(transactions.value)
const newTransactions = ref<Set<string>>(new Set())
const currentTime = ref(Date.now())
let intervalId: number | null = null

watch(transactions, (currentTransactions) => {
  if (currentTransactions.length > 0 && displayedTransactions.value.length === 0) {
    displayedTransactions.value = [...currentTransactions]
  }
})

watch(newBlockEvent, () => {
  setTimeout(() => {
    if (latestTransaction.value && latestTransaction.value.hash) {
      const existingIndex = displayedTransactions.value.findIndex(tx => tx.hash === latestTransaction.value!.hash)

      if (existingIndex === -1) {
        displayedTransactions.value = [latestTransaction.value, ...displayedTransactions.value].slice(0, 10)
        newTransactions.value.add(latestTransaction.value.hash)

        setTimeout(() => {
          newTransactions.value.delete(latestTransaction.value!.hash)
        }, 500)
      }
    }
  }, 350)
})

const isNewTransaction = (txHash: string) => {
  return newTransactions.value.has(txHash)
}

onMounted(() => {
  displayedTransactions.value = transactions.value
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

const formatTxTime = (timestamp: number) => {
  currentTime.value
  return formatTimeAgo(timestamp)
}

const getTimestampFromCreatedAt = (createdAt: string): number => {
  return Math.floor(new Date(createdAt).getTime() / 1000)
}
</script>

<template>
  <div class="latest-transactions">
    <div class="section-header">
      <h2>Latest Transactions</h2>
      <RouterLink
        to="/transactions"
        class="view-all-link"
      >
        View All
      </RouterLink>
    </div>

    <LoadingSpinner
      v-if="loading && displayedTransactions.length === 0"
      size="small"
    />

    <div
      v-else
      class="transactions-list"
    >
      <RouterLink
        v-for="tx in displayedTransactions"
        :key="tx.hash"
        :to="`/transactions/${tx.hash}`"
        class="transaction-item border-gradient glass-card"
        :class="{ 'new-item-enter': isNewTransaction(tx.hash) }"
      >
        <div class="tx-info">
          <span class="tx-code">TXN</span>
          <span class="mono tx-hash">{{ truncateHash(tx.hash, 10, 8) }}</span>
          <span class="tx-time">{{ formatTxTime(getTimestampFromCreatedAt(tx.createdAt)) }}</span>
        </div>
        <div class="tx-details">
          <div class="detail-row">
            <span class="detail-label">Block</span>
            <span class="mono">#{{ tx.blockNumber }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Position</span>
            <span class="mono">{{ tx.position }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.latest-transactions {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;

  h2 {
    font-size: $font-size-2xl;
    margin: 0;
  }
}

.view-all-link {
  color: $color-primary;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: $color-accent;
  }
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  min-height: 960px;
}

.transaction-item {
  padding: $spacing-md $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-lg;
  text-decoration: none;
  color: $color-text-primary;
  border-radius: $border-radius-lg;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  height: 88px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $border-radius-lg;
    background: $color-hover-overlay;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.01);

    &::after {
      opacity: 1;
    }
  }

  @include respond-to(sm) {
    gap: $spacing-2xl;
  }
}

.tx-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  min-width: 140px;
}

.tx-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.tx-hash {
  font-size: $font-size-sm;
  font-weight: 600;
}

.tx-time {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.tx-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  font-size: $font-size-sm;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: $spacing-md;
}

.detail-label {
  color: $color-text-secondary;
  font-weight: 500;
}

.new-item-enter {
  animation: newTransactionSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $border-radius-lg;
    background: rgba(255, 255, 255, 0.08);
    animation: highlightFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    pointer-events: none;

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.04);
    }
  }
}

@keyframes newTransactionSlide {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes highlightFade {
  0%, 60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
