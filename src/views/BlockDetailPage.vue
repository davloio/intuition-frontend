<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTransactions } from '@/composables/useTransactions'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { format } from 'date-fns'
import { formatNumber } from '@/utils/formatters'
import CopyableValue from '@/components/common/CopyableValue.vue'
import CopyIcon from '@/components/common/CopyIcon.vue'

const route = useRoute()
const blockNumber = computed(() => parseInt(route.params.identifier as string))

const { transactions, totalCount, loading, error } = useTransactions(
  100,
  0,
  blockNumber.value
)

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)
  return format(date, 'PPpp')
}

const blockTimestamp = computed(() => {
  if (transactions.value && transactions.value.length > 0) {
    return formatCreatedAt(transactions.value[0].createdAt)
  }
  return null
})

const copiedHash = ref<string | null>(null)

const handleCopyTxHash = async (event: Event, txHash: string) => {
  event.preventDefault()
  event.stopPropagation()
  
  try {
    await navigator.clipboard.writeText(txHash)
    copiedHash.value = txHash
    
    setTimeout(() => {
      copiedHash.value = null
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const isCopied = (txHash: string) => {
  return copiedHash.value === txHash
}
</script>

<template>
  <div class="block-detail-page">
    <div class="container">
      <RouterLink to="/blocks" class="back-link">
        ← Back to Blocks
      </RouterLink>

      <div class="page-header">
        <h1>Block #{{ formatNumber(blockNumber) }}</h1>
        <p class="page-description">Block details and transactions</p>
      </div>

      <LoadingSpinner v-if="loading" />

      <ErrorMessage v-if="error" :message="error" show-icon />

      <div v-if="!loading && !error" class="block-detail">
        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">BLK-INFO</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Block Number</span>
            <CopyableValue :value="blockNumber.toString()" :display-value="formatNumber(blockNumber)" value-class="detail-value mono" inline />
          </div>

          <div class="detail-row">
            <span class="detail-label">Total Transactions</span>
            <span class="detail-value mono">{{ totalCount }}</span>
          </div>

          <div v-if="blockTimestamp" class="detail-row">
            <span class="detail-label">Indexed At</span>
            <span class="detail-value mono text-sm">{{ blockTimestamp }}</span>
          </div>
        </div>

        <div class="transactions-section">
          <h2>Transactions in this Block</h2>

          <div v-if="transactions.length === 0" class="empty-state">
            <p>No transactions found in this block</p>
          </div>

          <div v-else class="transactions-list">
            <RouterLink
              v-for="(tx, index) in transactions"
              :key="tx.hash"
              :to="`/transactions/${tx.hash}`"
              class="transaction-item border-gradient glass-card"
            >
              <div class="tx-main">
                <div class="tx-header">
                  <span class="tx-code">TXN</span>
                  <span class="tx-arrow">→</span>
                </div>
                <div class="tx-hash-row">
                  <span class="mono tx-hash-full" @click="handleCopyTxHash($event, tx.hash)">{{ tx.hash }}</span>
                  <CopyIcon :copied="isCopied(tx.hash)" @copy="handleCopyTxHash($event, tx.hash)" />
                </div>
                <div class="tx-meta">
                  <div class="meta-item">
                    <span class="meta-label">Position</span>
                    <span class="mono meta-value">{{ tx.position }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Indexed</span>
                    <span class="mono meta-value text-xs">{{ formatCreatedAt(tx.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block-detail-page {
  padding: $spacing-lg 0;
  min-height: 100vh;

  @include respond-to(md) {
    padding: $spacing-xl 0;
  }

  @include respond-to(lg) {
    padding: $spacing-2xl 0;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  color: $color-text-secondary;
  text-decoration: none;
  font-size: $font-size-sm;
  margin-bottom: $spacing-xl;
  transition: all 0.2s ease;

  &:hover {
    color: $color-primary;
    transform: translateX(-4px);
  }
}

.page-header {
  margin-bottom: $spacing-lg;

  @include respond-to(md) {
    margin-bottom: $spacing-xl;
  }

  @include respond-to(lg) {
    margin-bottom: $spacing-2xl;
  }

  h1 {
    font-size: $font-size-2xl;

    @include respond-to(md) {
      font-size: $font-size-3xl;
    }

    @include respond-to(lg) {
      font-size: $font-size-4xl;
    }
    margin: 0 0 $spacing-sm 0;
    font-family: $font-family-mono;
  }

  .page-description {
    color: $color-text-secondary;
    font-size: $font-size-base;
    margin: 0;
  }
}

.block-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-2xl;
}

.detail-card {
  padding: $spacing-md;

  @include respond-to(md) {
    padding: $spacing-lg;
  }

  @include respond-to(lg) {
    padding: $spacing-xl;
  }
  border-radius: $border-radius-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.detail-header {
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: $spacing-sm;
}

.detail-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm 0;
  font-size: $font-size-sm;
}

.detail-label {
  color: $color-text-secondary;
  font-weight: 500;
}

.detail-value {
  color: $color-text-primary;
  font-weight: 500;

  &.text-sm {
    font-size: $font-size-xs;
  }
}

.transactions-section {
  h2 {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-lg;
  }
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.transaction-item {
  padding: $spacing-md;

  @include respond-to(md) {
    padding: $spacing-lg;
  }
  color: $color-text-primary;
  border-radius: $border-radius-lg;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;

  &:hover {
    transform: translateY(-2px);
    background: $color-bg-card-hover;

    .tx-arrow {
      transform: translateX(4px);
    }
  }
}

.tx-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  width: 100%;
}

.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-xs;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tx-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.tx-arrow {
  color: $color-text-muted;
  font-size: $font-size-lg;
  transition: all 0.2s ease;
}

.tx-hash-row {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;
}

.tx-hash-full {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text-primary;
  word-break: break-all;
  flex: 1;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-secondary;
  }
}

.tx-meta {
  display: flex;
  gap: $spacing-2xl;
  padding-top: $spacing-xs;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.meta-label {
  color: $color-text-secondary;
  font-size: $font-size-xs;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  color: $color-text-primary;
  font-size: $font-size-sm;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: $spacing-3xl;
  color: $color-text-muted;
  font-size: $font-size-base;
}

.text-xs {
  font-size: 10px;
}
</style>
