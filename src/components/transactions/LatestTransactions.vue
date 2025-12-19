<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useTransactions, useTransactionsSubscription } from '@/composables/useTransactions'
import { truncateHash } from '@/utils/formatters'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const { transactions, loading } = useTransactions(10, 0)
const { latestTransaction } = useTransactionsSubscription()
const displayedTransactions = ref(transactions.value)
const newTransactions = ref<Set<string>>(new Set())

watch(transactions, (currentTransactions) => {
  if (currentTransactions.length > 0 && displayedTransactions.value.length === 0) {
    displayedTransactions.value = [...currentTransactions]
  }
})

watch(latestTransaction, (newTx) => {
  if (newTx && newTx.hash) {
    const existingIndex = displayedTransactions.value.findIndex(tx => tx.hash === newTx.hash)
    
    if (existingIndex === -1) {
      displayedTransactions.value = [newTx, ...displayedTransactions.value].slice(0, 10)
      newTransactions.value.add(newTx.hash)
      
      setTimeout(() => {
        newTransactions.value.delete(newTx.hash)
      }, 600)
    }
  }
})

const isNewTransaction = (txHash: string) => {
  return newTransactions.value.has(txHash)
}

onMounted(() => {
  displayedTransactions.value = transactions.value
})

const formatTxTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return format(date, 'HH:mm:ss')
}

const getTimestampFromCreatedAt = (createdAt: string): number => {
  return Math.floor(new Date(createdAt).getTime() / 1000)
}
</script>

<template>
  <div class="latest-transactions">
    <div class="section-header">
      <h2>Latest Transactions</h2>
      <RouterLink to="/transactions" class="view-all-link">View All</RouterLink>
    </div>

    <LoadingSpinner v-if="loading && displayedTransactions.length === 0" size="small" />

    <div v-else class="transactions-list">
      <RouterLink
        v-for="(tx, index) in displayedTransactions"
        :key="tx.hash"
        :to="`/transactions/${tx.hash}`"
        class="transaction-item border-gradient glass-card"
        :class="{ 'new-item': isNewTransaction(tx.hash), 'animate-in': !isNewTransaction(tx.hash), [`stagger-${index + 1}`]: !isNewTransaction(tx.hash) }"
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
  transition: all 0.3s ease;
  height: 88px;
  @include respond-to(sm) {
    gap: $spacing-2xl;
  }

  &:hover {
    transform: translateY(-2px);
    background: $color-bg-card-hover;
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

.new-item {
  animation: slideInFromTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
