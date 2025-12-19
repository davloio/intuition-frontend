<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTransactions } from '@/composables/useTransactions'
import TransactionCard from './TransactionCard.vue'
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
</script>

<template>
  <div class="transaction-list">
    <LoadingSpinner v-if="loading && transactions.length === 0" />

    <ErrorMessage v-if="error" :message="error" />

    <div v-if="!loading || transactions.length > 0" class="transactions-grid">
      <TransactionCard
        v-for="tx in transactions"
        :key="tx.hash"
        :transaction="tx"
      />
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

.transactions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  animation: fadeIn 0.6s ease;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
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
