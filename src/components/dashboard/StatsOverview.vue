<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useStats, useStatsSubscription } from '@/composables/useStats'
import { formatNumber } from '@/utils/formatters'

const { stats: statsData, loading, error } = useStats()
const { stats: liveStats } = useStatsSubscription()
const currentStats = ref(statsData.value)
const newBlockAnimation = ref(false)
const blockQueue = ref<number[]>([0, 0, 0])

watch(statsData, (newStats) => {
  if (newStats && !currentStats.value) {
    currentStats.value = newStats
  }
})

watch(liveStats, (newStats) => {
  if (newStats && currentStats.value && newStats.currentBlockHeight > currentStats.value.currentBlockHeight) {
    currentStats.value = newStats
    blockQueue.value = [blockQueue.value[1], blockQueue.value[2], newStats.currentBlockHeight]

    if (animationInterval.value) {
      clearInterval(animationInterval.value)
    }

    triggerAnimation()

    animationInterval.value = window.setInterval(() => {
      triggerAnimation()
    }, 4000)
  } else if (newStats) {
    currentStats.value = newStats
  }
})

const stats = computed(() => {
  if (!currentStats.value) {
    return [
      { label: 'CURRENT BLOCK', value: loading.value ? 'Loading...' : 'N/A', code: 'BLK-CUR' },
      { label: 'TOTAL TRANSACTIONS', value: loading.value ? 'Loading...' : 'N/A', code: 'TXN-TOT' }
    ]
  }

  return [
    { label: 'CURRENT BLOCK', value: currentStats.value.currentBlockHeight, code: 'BLK-CUR' },
    { label: 'TOTAL TRANSACTIONS', value: currentStats.value.totalTransactions, code: 'TXN-TOT' }
  ]
})

const transactionsPerBlock = computed(() => {
  if (!currentStats.value) return 0
  return Math.round(currentStats.value.totalTransactions / currentStats.value.currentBlockHeight)
})

const animationInterval = ref<number | null>(null)

const updatePulsePositions = () => {
  nextTick(() => {
    const flowTrack = document.querySelector('.flow-track')
    const nodes = document.querySelectorAll('.flow-node .node-icon')

    if (!flowTrack || nodes.length !== 3) return

    const trackRect = flowTrack.getBoundingClientRect()

    const nodeData = Array.from(nodes).map((node: Element) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const relativeX = centerX - trackRect.left
      const relativeY = centerY - trackRect.top

      return {
        x: (relativeX / trackRect.width) * 100,
        y: (relativeY / trackRect.height) * 100
      }
    })

    document.documentElement.style.setProperty('--pulse-start-x', `${nodeData[0].x}%`)
    document.documentElement.style.setProperty('--pulse-mid-x', `${nodeData[1].x}%`)
    document.documentElement.style.setProperty('--pulse-end-x', `${nodeData[2].x}%`)
    document.documentElement.style.setProperty('--pulse-y', `${nodeData[1].y}%`)
  })
}

const triggerAnimation = () => {
  newBlockAnimation.value = true
  setTimeout(() => {
    newBlockAnimation.value = false
  }, 2400)
}

onMounted(() => {
  updatePulsePositions()

  window.addEventListener('resize', updatePulsePositions)

  setTimeout(() => {
    triggerAnimation()
  }, 500)

  animationInterval.value = window.setInterval(() => {
    triggerAnimation()
  }, 4000)
})

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
  window.removeEventListener('resize', updatePulsePositions)
})
</script>

<template>
  <div class="stats-overview">
    <div class="stats-container">
      <div class="stats-grid">
        <div v-for="(stat, index) in stats" :key="stat.label" class="stat-card border-gradient glass-card animate-in" :class="`stagger-${index + 1}`">
          <div class="stat-header">
            <span class="stat-code">{{ stat.code }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">
            {{ typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value }}
          </div>
        </div>
      </div>

      <div class="stats-diagram border-gradient glass-card animate-in stagger-3">
        <div class="diagram-header">
          <span class="stat-code">BLK-FLOW</span>
        </div>
        <div class="diagram-content">
          <div class="flow-diagram" :class="{ 'active': newBlockAnimation }">
            <div class="flow-track">
              <div class="flow-node source">
                <div class="node-icon">
                  <div class="icon-block">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span class="node-label mono">BLOCKS</span>
              </div>

              <div class="flow-connection">
                <div class="connection-line"></div>
              </div>

              <div class="flow-node processor">
                <div class="node-icon">
                  <div class="icon-process">
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span class="node-label mono">SYNC</span>
              </div>

              <div class="flow-connection">
                <div class="connection-line"></div>
              </div>

              <div class="flow-node destination">
                <div class="node-icon">
                  <div class="icon-data">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span class="node-label mono">DATA</span>
              </div>

              <div class="flow-pulse"></div>
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
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;

  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  padding: $spacing-sm $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: $border-radius-lg;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    background: $color-bg-card-hover;
    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.08);
  }
}

.stat-header {
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.stat-label {
  color: $color-text-secondary;
  font-size: $font-size-xs;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-top: 20px;
}

.stat-value {
  color: $color-text-primary;
  font-size: $font-size-3xl;
  font-weight: 600;
  font-family: $font-family-mono;
  letter-spacing: -0.01em;
}

.stats-diagram {
  padding: $spacing-sm;
  border-radius: $border-radius-lg;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 130px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    background: $color-bg-card-hover;
    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.08);
  }
}

.diagram-header {
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.diagram-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 4px;
  overflow: visible;
}

.flow-diagram {
  width: 100%;
  padding: $spacing-md 0;
  overflow: visible;
}

.flow-track {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  justify-content: center;
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  overflow: visible;
}

.node-icon {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
  backdrop-filter: blur(4px);
}



.icon-block {
  width: 20px;
  height: 20px;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.05);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  padding: 2px;

  span {
    display: block;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 1px;

    &:nth-child(1) {
      opacity: 0.8;
    }

    &:nth-child(2) {
      opacity: 0.7;
    }

    &:nth-child(3) {
      opacity: 0.6;
    }

    &:nth-child(4) {
      opacity: 0.7;
    }
  }
}

.icon-process {
  width: 22px;
  height: 22px;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
  }

  &::before {
    top: 50%;
    left: -1px;
    transform: translateY(-50%);
  }

  &::after {
    top: 50%;
    right: -1px;
    transform: translateY(-50%);
  }

  span {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;

    &:nth-child(1) {
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:nth-child(2) {
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.icon-data {
  width: 20px;
  height: 22px;
  position: relative;
  display: flex;
  justify-content: center;
  gap: 2px;

  span {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 3px;

    &:nth-child(1)::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      box-shadow:
        0 4px 0 rgba(255, 255, 255, 0.7),
        0 8px 0 rgba(255, 255, 255, 0.6),
        0 12px 0 rgba(255, 255, 255, 0.5),
        0 16px 0 rgba(255, 255, 255, 0.6),
        0 20px 0 rgba(255, 255, 255, 0.7);
    }

    &:nth-child(2)::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      box-shadow:
        0 4px 0 rgba(255, 255, 255, 0.6),
        0 8px 0 rgba(255, 255, 255, 0.5),
        0 12px 0 rgba(255, 255, 255, 0.6),
        0 16px 0 rgba(255, 255, 255, 0.7),
        0 20px 0 rgba(255, 255, 255, 0.6);
    }

    &:nth-child(3)::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      box-shadow:
        0 4px 0 rgba(255, 255, 255, 0.7),
        0 8px 0 rgba(255, 255, 255, 0.5),
        0 12px 0 rgba(255, 255, 255, 0.6),
        0 16px 0 rgba(255, 255, 255, 0.7),
        0 20px 0 rgba(255, 255, 255, 0.5);
    }

    &:nth-child(4)::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      box-shadow:
        0 4px 0 rgba(255, 255, 255, 0.6),
        0 8px 0 rgba(255, 255, 255, 0.7),
        0 12px 0 rgba(255, 255, 255, 0.5),
        0 16px 0 rgba(255, 255, 255, 0.6),
        0 20px 0 rgba(255, 255, 255, 0.8);
    }
  }
}

.node-label {
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.flow-connection {
  position: relative;
  width: 60px;
  height: 2px;
  margin: 0 $spacing-md;
  margin-bottom: 18px;
  overflow: visible;
}

.connection-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 100%
  );
  border-radius: 1px;
  position: relative;
}

.flow-pulse {
  position: absolute;
  top: var(--pulse-y, 36.2%);
  left: var(--pulse-start-x, 20.5%);
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 50%;
  box-shadow:
    0 0 20px 4px rgba(255, 255, 255, 0.8),
    0 0 30px 6px rgba(255, 255, 255, 0.5),
    0 0 40px 8px rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
  filter: blur(0.5px);
}

.flow-diagram.active {
  .flow-pulse {
    animation: smoothFlow 2.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .flow-node .node-icon {
    transition: all 0.3s ease;
  }

  .flow-node:nth-child(1) .node-icon {
    animation: subtleGlow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation-delay: 0s;
  }

  .flow-node:nth-child(3) .node-icon {
    animation: subtleGlow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation-delay: 0.72s;
  }

  .flow-node:nth-child(5) .node-icon {
    animation: subtleGlow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation-delay: 1.56s;
  }
}

@keyframes smoothFlow {
  0% {
    left: var(--pulse-start-x, 20.5%);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
  5% {
    left: var(--pulse-start-x, 20.5%);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    left: var(--pulse-mid-x, 50.22%);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  35% {
    left: var(--pulse-mid-x, 50.22%);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  65% {
    left: var(--pulse-end-x, 79.72%);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  95% {
    left: var(--pulse-end-x, 79.72%);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    left: var(--pulse-end-x, 79.72%);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
}

@keyframes subtleGlow {
  0% {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
  }
  50% {
    border-color: rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 0 15px rgba(255, 255, 255, 0.35),
      0 0 25px rgba(255, 255, 255, 0.15),
      inset 0 0 10px rgba(255, 255, 255, 0.12);
  }
  100% {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
  }
}
</style>
