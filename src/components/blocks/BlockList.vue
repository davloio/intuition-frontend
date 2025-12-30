<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlocks } from '@/composables/useBlocks'
import { formatNumber } from '@/utils/formatters'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const ITEMS_PER_PAGE = 20
const currentPage = ref(1)
const offset = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)

const { blocks, totalCount, loading, error, refetch } = useBlocks(
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

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return format(date, 'MMM dd, HH:mm:ss')
}

const maxTxns = computed(() => {
  return Math.max(...blocks.value.map(b => b.transactionCount), 1)
})

const getTxnBarWidth = (count: number) => {
  return (count / maxTxns.value) * 100
}
</script>

<template>
  <div class="block-list">
    <LoadingSpinner v-if="loading && blocks.length === 0" />

    <ErrorMessage v-if="error" :message="error" />

    <div v-if="!loading || blocks.length > 0" class="blocks-mosaic">
      <RouterLink
        v-for="(block, index) in blocks"
        :key="block.number"
        :to="`/blocks/${block.number}`"
        class="block-tile border-gradient glass-card animate-in"
        :class="`stagger-${Math.min(index + 1, 10)}`"
      >
        <div class="tile-diagonal"></div>

        <div class="tile-header">
          <div class="header-left">
            <span class="block-label">BLK</span>
            <span class="block-number mono">{{ formatNumber(block.number) }}</span>
          </div>
          <div class="header-right">
            <span class="timestamp-label">INDEXED</span>
            <span class="timestamp-value mono">{{ format(new Date(block.createdAt), 'HH:mm:ss') }}</span>
          </div>
        </div>

        <div class="tile-body">
          <div class="data-section">
            <div class="data-metric">
              <span class="metric-label">TXN COUNT</span>
              <span class="metric-value mono">{{ block.transactionCount }}</span>
            </div>
            <div class="visual-bar-container">
              <div class="visual-bar" :style="{ width: getTxnBarWidth(block.transactionCount) + '%' }"></div>
            </div>
          </div>

          <div class="data-split">
            <div class="split-item">
              <span class="split-label">BLOCK TIME</span>
              <span class="split-value mono">{{ formatTimestamp(block.timestamp) }}</span>
            </div>
          </div>
        </div>

        <div class="tile-footer">
          <div class="footer-accent"></div>
          <span class="footer-code mono">#{{ formatNumber(block.number) }}</span>
        </div>
      </RouterLink>
    </div>

    <div v-if="blocks.length === 0 && !loading && !error" class="empty-state">
      <p>No blocks found</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="btn-secondary"
        @click="previousPage"
        :disabled="currentPage === 1 || loading"
      >
        Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
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
.block-list {
  width: 100%;
}

.blocks-mosaic {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  animation: fadeIn 0.6s ease;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;
  }
}

.block-tile {
  position: relative;
  padding: $spacing-xl;
  text-decoration: none;
  color: $color-text-primary;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 200px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(255, 255, 255, 0.12);

    .tile-diagonal {
      transform: translateX(0) rotate(45deg);
      opacity: 0.15;
    }

    .visual-bar {
      transform: scaleX(1.05);
    }

    .footer-accent {
      width: 100%;
    }
  }
}

.tile-diagonal {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100%;
  height: 200%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
  transform: translateX(100%) rotate(45deg);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  opacity: 0;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-lg;
  gap: $spacing-md;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.block-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.15em;
  font-weight: 600;
}

.block-number {
  font-size: 28px;
  font-weight: 700;
  color: $color-text-primary;
  line-height: 1;
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.timestamp-label {
  font-family: $font-family-mono;
  font-size: 8px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.timestamp-value {
  font-size: 11px;
  color: $color-text-secondary;
}

.tile-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.data-metric {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.metric-label {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
  color: $color-text-primary;
}

.visual-bar-container {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.04);
  }
}

.visual-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.6) 100%);
  border-radius: 2px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);

  [data-theme="light"] & {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.35) 100%);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  }
}

.data-split {
  display: flex;
  gap: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-top-color: rgba(0, 0, 0, 0.04);
  }
}

.split-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.split-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.split-value {
  font-size: 13px;
  color: $color-text-secondary;
}

.tile-footer {
  position: relative;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;

  [data-theme="light"] & {
    border-top-color: rgba(0, 0, 0, 0.05);
  }
}

.footer-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme="light"] & {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.08) 100%);
  }
}

.footer-code {
  font-size: 11px;
  color: $color-text-muted;
  font-weight: 500;
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
