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
const activeStage = ref(-1)

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

const animateFlow = () => {
  const stages = [0, 1, 2, 3]
  let currentIndex = 0

  const animateNext = () => {
    if (currentIndex < stages.length) {
      activeStage.value = stages[currentIndex]!
      currentIndex++
      setTimeout(animateNext, 400)
    } else {
      setTimeout(() => {
        activeStage.value = -1
      }, 600)
    }
  }

  animateNext()
}

watch(liveStats, (newStats) => {
  if (newStats && currentStats.value && newStats.currentBlockHeight > currentStats.value.currentBlockHeight) {
    const oldValue = currentStats.value.currentBlockHeight
    currentStats.value = newStats

    triggerNewBlockEvent()

    animateCounter(oldValue, newStats.currentBlockHeight)
    animateFlow()

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

const flowStages = [
  {
    label: 'BLOCKCHAIN',
    sublabel: 'Intuition Network',
    code: 'SRC-01',
    detail: 'Data Source'
  },
  {
    label: 'INDEXER',
    sublabel: 'Rust Processor',
    code: 'SRC-02',
    detail: 'Block Processing'
  },
  {
    label: 'GRAPHQL',
    sublabel: 'API Gateway',
    code: 'SRC-03',
    detail: 'Data Access'
  },
  {
    label: 'EXPLORER',
    sublabel: 'Vue Frontend',
    code: 'SRC-04',
    detail: 'Visualization'
  }
]
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

      <div class="visualization-column">
        <div class="architecture-card border-gradient glass-card animate-in stagger-4">
          <div class="card-header-section">
            <div class="stat-header">
              <span class="stat-code">DATA-FLOW</span>
            </div>
          </div>

          <div class="architecture-flow">
            <div
              v-for="(stage, index) in flowStages"
              :key="stage.code"
              class="flow-layer"
              :class="{ active: activeStage === index }"
            >
              <div class="layer-badge">
                <span class="badge-number">{{ index + 1 }}</span>
              </div>

              <div class="layer-content">
                <div class="layer-main">
                  <div class="layer-code">
                    {{ stage.code }}
                  </div>
                  <div class="layer-title">
                    {{ stage.label }}
                  </div>
                </div>
                <div class="layer-meta">
                  <span class="layer-subtitle">{{ stage.sublabel }}</span>
                  <span class="layer-separator">•</span>
                  <span class="layer-detail">{{ stage.detail }}</span>
                </div>
              </div>

              <div class="layer-indicator">
                <div class="indicator-dot" />
              </div>

              <div
                v-if="index < flowStages.length - 1"
                class="layer-connector"
              >
                <div class="connector-line" />
                <div
                  class="connector-pulse"
                  :class="{ active: activeStage === index }"
                />
                <div class="connector-arrow">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M6 1L6 9M6 9L3 6M6 9L9 6"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
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
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;
  align-items: stretch;

  @include respond-to(lg) {
    grid-template-columns: 2fr 1fr;
  }
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

.visualization-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.architecture-card {
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  height: 100%;
}

.card-header-section {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 4px;
}

.arch-label {
  color: $color-text-secondary;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
  padding-bottom: 8px;
}

.architecture-flow {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: 0;
  flex: 1;
  justify-content: space-between;
}

.flow-layer {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  min-height: 60px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  [data-theme="light"] & {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
    border-color: rgba(0, 0, 0, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;

    [data-theme="light"] & {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.03));
    }
  }

  &.active {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
    transform: translateX(2px);

    [data-theme="light"] & {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%);
      border-color: rgba(0, 0, 0, 0.1);
      box-shadow:
        0 0 30px rgba(0, 0, 0, 0.05),
        inset 0 0 20px rgba(0, 0, 0, 0.02);
    }

    &::before {
      opacity: 1;
    }

    .layer-badge {
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);

      [data-theme="light"] & {
        background: rgba(0, 0, 0, 0.05);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
    }

    .indicator-dot {
      background: rgba(255, 255, 255, 0.9);
      box-shadow:
        0 0 8px rgba(255, 255, 255, 0.6),
        0 0 16px rgba(255, 255, 255, 0.3);
      animation: dotPulse 1s ease-in-out;

      [data-theme="light"] & {
        background: rgba(0, 0, 0, 0.7);
        box-shadow:
          0 0 8px rgba(0, 0, 0, 0.3),
          0 0 16px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

.layer-badge {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.06);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;

    [data-theme="light"] & {
      background: radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.08), transparent 70%);
    }
  }

  .flow-layer.active & {
    &::before {
      opacity: 1;
    }
  }
}

.badge-number {
  font-family: $font-family-mono;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;

  [data-theme="light"] & {
    color: rgba(0, 0, 0, 0.7);
  }
}

.layer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.layer-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.layer-code {
  font-family: $font-family-mono;
  font-size: 7px;
  color: $color-text-muted;
  letter-spacing: 0.12em;
  font-weight: 500;
  opacity: 0.5;
}

.layer-title {
  font-family: $font-family-mono;
  font-size: 12px;
  color: $color-text-primary;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.layer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.layer-subtitle {
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.02em;
  font-weight: 400;
}

.layer-separator {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.2);

  [data-theme="light"] & {
    color: rgba(0, 0, 0, 0.2);
  }
}

.layer-detail {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.02em;
  font-weight: 400;
  font-style: italic;

  [data-theme="light"] & {
    color: rgba(0, 0, 0, 0.4);
  }
}

.layer-indicator {
  display: flex;
  align-items: center;
  padding-left: 8px;
  flex-shrink: 0;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  transition: all 0.4s ease;
  flex-shrink: 0;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.2);
  }
}

.layer-connector {
  position: absolute;
  left: 50%;
  bottom: calc(-1 * $spacing-lg);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.connector-line {
  width: 1.5px;
  height: $spacing-lg;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);

  [data-theme="light"] & {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.03) 100%);
  }
}

.connector-pulse {
  position: absolute;
  top: 0;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  opacity: 0;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.5);
  }

  &.active {
    animation: flowPulse 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.connector-arrow {
  margin-top: -3px;
  color: rgba(255, 255, 255, 0.5);

  [data-theme="light"] & {
    color: rgba(0, 0, 0, 0.4);
  }

  svg {
    display: block;
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));

    [data-theme="light"] & {
      filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.15));
    }
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

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

@keyframes flowPulse {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY($spacing-lg);
  }
}
</style>
