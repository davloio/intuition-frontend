<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useTransactions } from '@/composables/useTransactions'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const ITEMS_PER_PAGE = 20
const currentPage = ref(1)
const offset = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)

const { transactions, totalCount, loading, error, refetch } = useTransactions(
  ITEMS_PER_PAGE,
  offset.value
)

const totalPages = computed(() => Math.ceil(totalCount.value / ITEMS_PER_PAGE))

watch(currentPage, async (newPage) => {
  const newOffset = (newPage - 1) * ITEMS_PER_PAGE
  await refetch(ITEMS_PER_PAGE, newOffset)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const goToPage = (page: number) => {
  currentPage.value = page
}

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const truncateHash = (hash: string, start = 16, end = 12) => {
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`
}

const truncateAddress = (address?: string) => {
  if (!address) return 'N/A'
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

const formatValue = (value?: string) => {
  if (!value || value === '0') return '0'
  const ethValue = parseFloat(value) / 1e18
  if (ethValue < 0.0001) return '< 0.0001'
  return ethValue.toFixed(4)
}
</script>

<template>
  <div class="transaction-list">
    <LoadingSpinner v-if="loading && transactions.length === 0" />

    <ErrorMessage v-if="error" :message="error" />

    <div v-if="!loading || transactions.length > 0" class="txn-mosaic">
      <RouterLink
        v-for="(tx, index) in transactions"
        :key="tx.hash"
        :to="`/transactions/${tx.hash}`"
        class="txn-tile border-gradient glass-card animate-in"
        :class="`stagger-${Math.min(index + 1, 10)}`"
      >
        <div class="tile-glow"></div>

        <div class="tile-header">
          <div class="header-left">
            <span class="txn-label">TXN</span>
            <div class="hash-display">
              <span class="hash-part mono">{{ tx.hash.substring(0, 10) }}</span>
              <span class="hash-dots">...</span>
              <span class="hash-part mono">{{ tx.hash.substring(tx.hash.length - 8) }}</span>
            </div>
          </div>
          <div class="header-right">
            <span v-if="tx.status === 1" class="status-badge success">SUCCESS</span>
            <span v-else-if="tx.status === 0" class="status-badge failed">FAILED</span>
          </div>
        </div>

        <div class="tile-body">
          <div class="address-flow">
            <div class="flow-item">
              <span class="flow-label">FROM</span>
              <span class="flow-address mono">{{ truncateAddress(tx.fromAddress) }}</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">
              <span class="flow-label">TO</span>
              <span class="flow-address mono">{{ truncateAddress(tx.toAddress) }}</span>
            </div>
          </div>

          <div class="value-display">
            <span class="value-label">VALUE</span>
            <div class="value-amount">
              <span class="amount-value mono">{{ formatValue(tx.value) }}</span>
              <span class="amount-unit">ETH</span>
            </div>
          </div>

          <div class="meta-row">
            <div class="meta-compact">
              <span class="meta-label-inline">BLK</span>
              <span class="meta-value-inline mono">{{ tx.blockNumber }}</span>
            </div>
            <div class="meta-compact">
              <span class="meta-label-inline">POS</span>
              <span class="meta-value-inline mono">{{ tx.position }}</span>
            </div>
            <div class="meta-compact">
              <span class="timestamp mono">{{ format(new Date(tx.createdAt), 'HH:mm:ss') }}</span>
            </div>
          </div>
        </div>

        <div class="tile-footer">
          <div class="footer-bar"></div>
        </div>
      </RouterLink>
    </div>

    <div v-if="transactions.length === 0 && !loading && !error" class="empty-state">
      <p>No transactions found</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="btn-secondary"
        @click="previousPage"
        :disabled="currentPage === 1 || loading"
      >
        Previous
      </button>
      <span class="pagination-info"> Page {{ currentPage }} of {{ totalPages }} </span>
      <button
        class="btn-secondary"
        @click="nextPage"
        :disabled="currentPage === totalPages || loading"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.transaction-list {
  width: 100%;
}

.txn-mosaic {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  animation: fadeIn 0.6s ease;

  @include respond-to(lg) {
    gap: $spacing-lg;
  }
}

.txn-tile {
  position: relative;
  padding: $spacing-xl;
  text-decoration: none;
  color: $color-text-primary;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &:hover {
    transform: translateX(8px) scale(1.01);
    box-shadow:
      0 8px 32px rgba(255, 255, 255, 0.08),
      inset 0 0 60px rgba(255, 255, 255, 0.02);

    .tile-glow {
      opacity: 0.6;
      transform: translateX(-50%) scale(1.2);
    }

    .footer-bar {
      width: 100%;
    }
  }
}

.tile-glow {
  position: absolute;
  top: 50%;
  left: -20%;
  width: 60%;
  height: 120%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  transform: translateX(-100%);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  opacity: 0;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  flex: 1;
}

.txn-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.15em;
  font-weight: 600;
}

.hash-display {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.hash-part {
  font-size: 15px;
  font-weight: 500;
  color: $color-text-primary;
  letter-spacing: -0.01em;
}

.hash-dots {
  font-size: 15px;
  color: $color-text-muted;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-family: $font-family-mono;
  font-size: 8px;
  letter-spacing: 0.1em;
  font-weight: 600;

  &.success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: rgba(16, 185, 129, 1);
  }

  &.failed {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: rgba(239, 68, 68, 1);
  }
}

.tile-body {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.address-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: $spacing-md;
  align-items: center;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.flow-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flow-label {
  font-family: $font-family-mono;
  font-size: 8px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.flow-address {
  font-size: 13px;
  color: $color-text-secondary;
  font-weight: 500;
}

.flow-arrow {
  font-size: 18px;
  color: $color-text-muted;
  opacity: 0.4;
}

.value-display {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.value-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.value-amount {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.amount-value {
  font-size: 24px;
  font-weight: 700;
  color: $color-text-primary;
}

.amount-unit {
  font-size: 14px;
  color: $color-text-secondary;
  font-weight: 500;
}

.meta-row {
  display: flex;
  gap: $spacing-xl;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
}

.meta-compact {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.meta-label-inline {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.meta-value-inline {
  font-size: 13px;
  color: $color-text-secondary;
  font-weight: 500;
}

.timestamp {
  font-size: 11px;
  color: $color-text-muted;
  font-weight: 500;
}

.tile-footer {
  position: relative;
}

.footer-bar {
  height: 1px;
  width: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.empty-state {
  text-align: center;
  padding: $spacing-3xl;
  color: $color-text-muted;
  font-size: $font-size-lg;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  padding: $spacing-lg 0;
}

.pagination-info {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  font-weight: 500;
}

@media (max-width: 640px) {
  .address-flow {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }

  .flow-arrow {
    display: none;
  }
}
</style>
