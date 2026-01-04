<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useStats, useStatsSubscription } from '@/composables/useStats'
import { formatNumber } from '@/utils/formatters'
import { useBlockchainEvents } from '@/composables/useBlockchainEvents'

const { stats: statsData, loading } = useStats()
const { stats: liveStats } = useStatsSubscription()
const { triggerNewBlockEvent } = useBlockchainEvents()
const currentStats = ref(statsData.value)
const newBlockAnimation = ref(false)
const displayValue = ref<number>(0)
const isAnimating = ref(false)

watch(statsData, (newStats) => {
  if (newStats && !currentStats.value) {
    currentStats.value = newStats
    displayValue.value = newStats.currentBlockHeight
  }
})

const animateCounter = (start: number, end: number, duration = 1200) => {
  isAnimating.value = true
  const range = end - start
  const startTime = performance.now()

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    displayValue.value = Math.floor(start + range * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      isAnimating.value = false
    }
  }

  requestAnimationFrame(step)
}

watch(liveStats, (newStats) => {
  if (newStats && currentStats.value && newStats.currentBlockHeight > currentStats.value.currentBlockHeight) {
    const oldValue = currentStats.value.currentBlockHeight
    currentStats.value = newStats

    triggerNewBlockEvent()

    animateCounter(oldValue, newStats.currentBlockHeight)

    newBlockAnimation.value = true
    setTimeout(() => {
      newBlockAnimation.value = false
    }, 1800)
  } else if (newStats) {
    currentStats.value = newStats
    if (!isAnimating.value && displayValue.value === 0) {
      displayValue.value = newStats.currentBlockHeight
    }
  }
})

const stats = computed(() => {
  if (!currentStats.value) {
    return [
      { label: 'CURRENT BLOCK', value: loading.value ? 'Loading...' : 'N/A', code: 'BLK-CUR' },
      { label: 'TOTAL TRANSACTIONS', value: loading.value ? 'Loading...' : 'N/A', code: 'TXN-TOT' },
      { label: 'TOTAL ADDRESSES', value: loading.value ? 'Loading...' : 'N/A', code: 'ADDR-TOT' }
    ]
  }

  return [
    { label: 'CURRENT BLOCK', value: currentStats.value.currentBlockHeight, code: 'BLK-CUR' },
    { label: 'TOTAL TRANSACTIONS', value: currentStats.value.totalTransactions, code: 'TXN-TOT' },
    { label: 'TOTAL ADDRESSES', value: currentStats.value.totalAddresses, code: 'ADDR-TOT' }
  ]
})
</script>

<template>
  <div class="stats-overview">
    <div class="live-indicator">
      <span class="live-dot" />
      <span class="live-text">LIVE</span>
    </div>

    <div class="stats-container">
      <div class="stats-column">
        <div
          v-for="(stat, index) in stats"
          :key="stat.code"
          class="stat-card border-gradient glass-card animate-in"
          :class="[`stagger-${index + 1}`, { 'hero-stat-card': index === 0, 'new-block': index === 0 && newBlockAnimation }]"
        >
          <div class="stat-header">
            <span class="stat-code">{{ stat.code }}</span>
          </div>
          <div class="stat-label">
            {{ stat.label }}
          </div>
          <div
            class="stat-value"
            :class="{ 'hero-value': index === 0 }"
          >
            {{ typeof stat.value === 'number' ? formatNumber(index === 0 ? displayValue || stat.value : stat.value) : stat.value }}
          </div>
          <div
            v-if="index === 0"
            class="progress-bar"
            :class="{ active: newBlockAnimation }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats-overview {
  width: 100%;
  margin-bottom: $spacing-xs;
  position: relative;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  margin-bottom: $spacing-lg;
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme="light"] & {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.3);
  }
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
  animation: livePulse 2s ease-in-out infinite;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: #10b981;
    opacity: 0.3;
    animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
}

.live-text {
  font-family: $font-family-mono;
  font-size: 11px;
  color: #10b981;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.stats-container {
  width: 100%;
}

.stats-column {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.stat-card {
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: $border-radius-lg;
  position: relative;
}

.hero-stat-card {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: $border-radius-lg;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &.new-block {
    &::before {
      animation: borderFlash 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::after {
      animation: heroGlowPulse 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-value {
      animation: valueUpdate 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }
}

.stat-header {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-bottom-color: rgba(0, 0, 0, 0.04);
  }
}

.stat-code {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.stat-label {
  color: $color-text-secondary;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  margin-top: 2px;
  text-transform: uppercase;
}



.stat-value {
  color: $color-text-primary;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: $font-family-mono;
  letter-spacing: -0.01em;
  margin-top: 2px;
  transition: filter 0.3s ease;
}

.hero-value {
  font-size: 3rem;
  font-weight: 600;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);

  [data-theme="light"] & {
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.2) 20%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.2) 80%,
      transparent 100%
    );
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  }

  &.active {
    animation: progressFill 1.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@keyframes heroGlowPulse {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes valueUpdate {
  0% {
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
  25% {
    transform: translateY(-4px) scale(1.03);
    filter: brightness(1.2);
  }
  50% {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.15);
  }
  100% {
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
}

@keyframes borderFlash {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  30% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}

@keyframes progressFill {
  0% {
    width: 0%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

@keyframes livePulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
  }
}

@keyframes livePing {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  75%, 100% {
    opacity: 0;
    transform: scale(2);
  }
}
</style>
