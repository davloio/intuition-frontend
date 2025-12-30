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

const formatTimestamp = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss')
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
          <span class="txn-label">TXN</span>
          <div class="hash-display">
            <span class="hash-part mono">{{ tx.hash.substring(0, 16) }}</span>
            <span class="hash-dots">...</span>
            <span class="hash-part mono">{{ tx.hash.substring(tx.hash.length - 12) }}</span>
          </div>
        </div>

        <div class="tile-body">
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">BLOCK</span>
              <span class="meta-value mono">{{ tx.blockNumber }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">POSITION</span>
              <span class="meta-value mono">{{ tx.position }}</span>
            </div>
          </div>

          <div class="timestamp-row">
            <span class="timestamp-label">TIMESTAMP</span>
            <span class="timestamp-value mono">{{ formatTimestamp(tx.createdAt) }}</span>
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

  [data-theme="light"] & {
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.04) 0%, transparent 70%);
  }
}

.tile-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
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

.tile-body {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.meta-value {
  font-size: 15px;
  color: $color-text-secondary;
  font-weight: 500;
}

.timestamp-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-top-color: rgba(0, 0, 0, 0.04);
  }
}

.timestamp-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.timestamp-value {
  font-size: 13px;
  color: $color-text-secondary;
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

  [data-theme="light"] & {
    background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  }
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

</style>
