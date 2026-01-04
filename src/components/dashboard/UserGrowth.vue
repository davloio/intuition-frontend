<template>
  <div class="user-growth border-gradient glass-card">
    <div class="growth-header">
      <div class="header-left">
        <div class="stat-header">
          <span class="stat-code">USR-GROWTH</span>
        </div>
        <div class="stat-label">
          Network User Growth
        </div>
      </div>
      <div
        v-if="!loading && dataPoints.length > 0"
        class="total-users-card"
      >
        <div class="total-label">
          TOTAL USERS
        </div>
        <div class="total-value mono">
          {{ formatNumber(dataPoints[dataPoints.length - 1]?.totalAddresses ?? 0) }}
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="chart-loading"
    >
      <div class="loading-spinner" />
    </div>

    <div
      v-else-if="error"
      class="chart-error"
    >
      <p class="error-text">
        {{ error }}
      </p>
    </div>

    <div
      v-else-if="dataPoints.length > 0"
      class="chart-container"
    >
      <svg
        class="growth-chart"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          :d="areaPath"
          class="area-path"
        />

        <path
          :d="linePath"
          fill="none"
          stroke-width="2"
          class="line-path"
        />

        <g class="data-points">
          <circle
            v-for="(point, index) in chartPoints" 
            :key="`point-${index}`"
            :cx="point.x"
            :cy="point.y"
            :r="hoveredPoint === index ? 5 : 3"
            class="data-point"
            @mouseenter="hoveredPoint = index"
            @mouseleave="hoveredPoint = null"
          />
        </g>

        <g class="axis-labels">
          <text
            v-for="(point, index) in dataPoints"
            :key="`label-${index}`"
            :x="chartPoints[index]?.x ?? 0"
            :y="chartHeight - padding + 20"
            text-anchor="middle"
            class="axis-label"
          >
            {{ formatDate(point.timestamp) }}
          </text>
        </g>
      </svg>

      <div
        v-if="hoveredPoint !== null && chartPoints[hoveredPoint] && dataPoints[hoveredPoint]"
        class="tooltip"
        :style="{ left: `${(chartPoints[hoveredPoint]!.x / chartWidth) * 100}%` }"
      >
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-label">Block</span>
            <span class="tooltip-value mono">{{ formatNumber(dataPoints[hoveredPoint]!.blockNumber) }}</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">Addresses</span>
            <span class="tooltip-value mono">{{ formatNumber(dataPoints[hoveredPoint]!.totalAddresses) }}</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">Date</span>
            <span class="tooltip-value">{{ formatFullDate(dataPoints[hoveredPoint]!.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserGrowth } from '@/composables/useUserGrowth'
import { format } from 'date-fns'

const { dataPoints, loading, error } = useUserGrowth()

const hoveredPoint = ref<number | null>(null)

const chartWidth = 1200
const chartHeight = 350
const padding = 60

const chartPoints = computed(() => {
  if (!dataPoints.value || dataPoints.value.length === 0) return []

  const values = dataPoints.value.map(d => d.totalAddresses)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue || 1

  return dataPoints.value.map((point, index) => {
    const x = padding + ((chartWidth - padding * 2) / (dataPoints.value.length - 1)) * index
    const normalizedValue = (point.totalAddresses - minValue) / valueRange
    const y = chartHeight - padding - (normalizedValue * (chartHeight - padding * 2))
    
    return { x, y }
  })
})

const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''

  const points = chartPoints.value
  const firstPoint = points[0]
  if (!firstPoint) return ''

  let path = `M ${firstPoint.x} ${firstPoint.y}`

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currentPoint = points[i]
    if (!prevPoint || !currentPoint) continue

    const controlPointX1 = prevPoint.x + (currentPoint.x - prevPoint.x) / 3
    const controlPointX2 = prevPoint.x + (2 * (currentPoint.x - prevPoint.x)) / 3

    path += ` C ${controlPointX1} ${prevPoint.y}, ${controlPointX2} ${currentPoint.y}, ${currentPoint.x} ${currentPoint.y}`
  }

  return path
})

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''

  const points = chartPoints.value
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  if (!firstPoint || !lastPoint) return ''

  let path = `M ${firstPoint.x} ${chartHeight - padding}`
  path += ` L ${firstPoint.x} ${firstPoint.y}`

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currentPoint = points[i]
    if (!prevPoint || !currentPoint) continue

    const controlPointX1 = prevPoint.x + (currentPoint.x - prevPoint.x) / 3
    const controlPointX2 = prevPoint.x + (2 * (currentPoint.x - prevPoint.x)) / 3

    path += ` C ${controlPointX1} ${prevPoint.y}, ${controlPointX2} ${currentPoint.y}, ${currentPoint.x} ${currentPoint.y}`
  }

  path += ` L ${lastPoint.x} ${chartHeight - padding}`
  path += ` Z`

  return path
})

const formatDate = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM d, yy')
}

const formatFullDate = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM d, yyyy')
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/index" as *;

.user-growth {
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  width: 100%;

  @include respond-to(lg) {
    padding: $spacing-xl;
  }
}

.growth-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-lg;
  flex-wrap: wrap;

  @include respond-to(md) {
    align-items: center;
  }
}

.header-left {
  flex: 1;
}

.stat-header {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-bottom-color: rgba(0, 0, 0, 0.08);
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
  color: $color-text-primary;
  font-size: $font-size-base;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-top: $spacing-sm;
  margin-bottom: $spacing-md;
  text-transform: none;
}

.total-users-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: $spacing-sm $spacing-md;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-md;
  min-width: 140px;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.08);
  }
}

.total-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.total-value {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $color-text-primary;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  padding: $spacing-xl;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  [data-theme="light"] & {
    border-color: rgba(0, 0, 0, 0.1);
    border-top-color: rgba(0, 0, 0, 0.5);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-error {
  padding: $spacing-xl;
  text-align: center;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-text {
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.chart-container {
  margin-top: $spacing-lg;
  position: relative;
  width: 100%;
}

.growth-chart {
  width: 100%;
  height: auto;
  display: block;
}

.area-path {
  fill: rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    fill: rgba(0, 0, 0, 0.08);
  }
}

.line-path {
  stroke: rgba(255, 255, 255, 0.4);
  stroke-linecap: round;
  stroke-linejoin: round;

  [data-theme="light"] & {
    stroke: rgba(0, 0, 0, 0.5);
  }
}

.data-point {
  fill: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;

  [data-theme="light"] & {
    fill: rgba(0, 0, 0, 0.6);
  }

  &:hover {
    fill: rgba(255, 255, 255, 0.9);

    [data-theme="light"] & {
      fill: rgba(0, 0, 0, 0.9);
    }
  }
}

.axis-label {
  font-family: $font-family-mono;
  font-size: 9px;
  fill: rgba(255, 255, 255, 0.6);

  [data-theme="light"] & {
    fill: rgba(0, 0, 0, 0.5);
  }
}

.tooltip {
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 100;
}

.tooltip-content {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: $spacing-sm $spacing-md;
  display: flex;
  flex-direction: column;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

  [data-theme="light"] & {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  gap: $spacing-md;
  align-items: center;
}

.tooltip-label {
  font-size: 10px;
  color: $color-text-muted;
  font-weight: 500;
}

.tooltip-value {
  font-size: $font-size-xs;
  color: $color-text-primary;
  font-weight: 500;

  &.mono {
    font-family: $font-family-mono;
  }
}
</style>
