<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlocks } from '@/composables/useBlocks'


const { blocks, refetch } = useBlocks()
const avgTransactionsPerBlock = ref(0)
const blockTime = ref(12)

const calculateMetrics = async () => {
  await refetch(20, 0)

  if (blocks.value.length > 0) {
    const totalTxs = blocks.value.reduce((sum, block) => sum + block.transactionCount, 0)

    avgTransactionsPerBlock.value = Math.round((totalTxs / blocks.value.length) * 10) / 10
  }
}

onMounted(() => {
  calculateMetrics()
})
</script>

<template>
  <div class="network-metrics">
    <div class="metrics-header">
      <span class="metrics-code">SYS-MET</span>
      <h3>NETWORK METRICS</h3>
    </div>
    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-code">TXN-AVG</span>
          <span class="metric-label">AVERAGE TXS/BLOCK</span>
        </div>
        <div class="metric-value">
          {{ avgTransactionsPerBlock }}
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill"
            :style="{ width: '60%' }"
          />
        </div>
        <span class="metric-percentage">60%</span>
      </div>

      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-code">BLK-TIME</span>
          <span class="metric-label">BLOCK TIME</span>
        </div>
        <div class="metric-value">
          {{ blockTime }}<span class="metric-unit">s</span>
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill active"
            :style="{ width: '100%' }"
          />
        </div>
        <span class="metric-percentage">OPTIMAL</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.network-metrics {
  width: 100%;
  margin-bottom: $spacing-3xl;
}

.metrics-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.metrics-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

h3 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-item {
  padding: $spacing-xl;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  animation: fadeIn 0.6s ease;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: transparent;
    transition: background 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);

    &::before {
      background: $color-text-primary;
    }
  }
}

.metric-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.metric-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.metric-label {
  color: $color-text-secondary;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.metric-value {
  color: $color-text-primary;
  font-size: $font-size-3xl;
  font-weight: 300;
  font-family: $font-family-mono;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: $spacing-sm;
}

.metric-unit {
  font-size: $font-size-lg;
  color: $color-text-muted;
  margin-left: $spacing-xs;
}

.metric-bar {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
}

.metric-fill {
  height: 100%;
  background: $color-text-muted;
  transition: width 1s ease;

  &.active {
    background: $color-text-primary;
  }
}

.metric-percentage {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  margin-top: $spacing-xs;
}
</style>
