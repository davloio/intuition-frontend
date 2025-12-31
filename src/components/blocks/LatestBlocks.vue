<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlocks, useBlocksSubscription } from '@/composables/useBlocks'
import { formatNumber } from '@/utils/formatters'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'
import { useBlockchainEvents } from '@/composables/useBlockchainEvents'

const { blocks, loading } = useBlocks(10, 0)
const { latestBlock } = useBlocksSubscription()
const { newBlockEvent } = useBlockchainEvents()
const displayedBlocks = ref(blocks.value)
const newBlocks = ref<Set<number>>(new Set())

watch(blocks, (currentBlocks) => {
  if (currentBlocks.length > 0 && displayedBlocks.value.length === 0) {
    displayedBlocks.value = [...currentBlocks]
  }
})

watch(newBlockEvent, () => {
  setTimeout(() => {
    if (latestBlock.value && latestBlock.value.number) {
      const existingIndex = displayedBlocks.value.findIndex(b => b.number === latestBlock.value!.number)

      if (existingIndex === -1) {
        displayedBlocks.value = [latestBlock.value, ...displayedBlocks.value].slice(0, 10)
        newBlocks.value.add(latestBlock.value.number)

        setTimeout(() => {
          newBlocks.value.delete(latestBlock.value!.number)
        }, 500)
      }
    }
  }, 300)
})

const isNewBlock = (blockNumber: number) => {
  return newBlocks.value.has(blockNumber)
}

onMounted(() => {
  displayedBlocks.value = blocks.value
})

const formatBlockTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return format(date, 'HH:mm:ss')
}
</script>

<template>
  <div class="latest-blocks">
    <div class="section-header">
      <h2>Latest Blocks</h2>
      <RouterLink to="/blocks" class="view-all-link">View All</RouterLink>
    </div>

    <LoadingSpinner v-if="loading && displayedBlocks.length === 0" size="small" />

    <div v-else class="blocks-list">
      <RouterLink
        v-for="(block, index) in displayedBlocks"
        :key="block.number"
        :to="`/blocks/${block.number}`"
        class="block-item border-gradient glass-card"
        :class="{ 'new-item-enter': isNewBlock(block.number) }"
      >
        <div class="block-info">
          <span class="block-code">BLK</span>
          <span class="block-number mono">{{ formatNumber(block.number) }}</span>
          <span class="block-time">{{ formatBlockTime(block.timestamp) }}</span>
        </div>
        <div class="block-details">
          <div class="detail-row">
            <span class="detail-label">Txns</span>
            <span class="mono">{{ block.transactionCount }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.latest-blocks {
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

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  min-height: 960px;
}

.block-item {
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

.block-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  min-width: 140px;
}

.block-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.block-number {
  font-size: $font-size-lg;
  font-weight: 600;
}

.block-time {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.block-details {
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
  animation: newBlockSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

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

@keyframes newBlockSlide {
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
