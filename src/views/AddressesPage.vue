<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAddresses } from '@/composables/useAddresses'
import { formatWei, truncateAddress } from '@/utils/formatters'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const page = ref(1)
const pageSize = 20

const offset = computed(() => (page.value - 1) * pageSize)
const { addresses, totalCount, loading, error } = useAddresses(pageSize, offset.value)

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

const goToNextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevPage = () => {
  if (page.value > 1) {
    page.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const maxBalance = computed(() => {
  const balances = addresses.value.map(a => parseFloat(a.balance || '0'))
  return Math.max(...balances, 1)
})

const getBalanceWidth = (balance: string) => {
  const val = parseFloat(balance || '0')
  return (val / maxBalance.value) * 100
}


</script>

<template>
  <div class="addresses-page">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Addresses</h1>
          <p class="page-description">All addresses on the Intuition blockchain</p>
        </div>

        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-label">Total Addresses</span>
            <span class="stat-value mono">{{ totalCount.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <ErrorMessage v-else-if="error" :message="error" />

      <div v-else class="addresses-content">
        <div class="address-mosaic">
          <RouterLink
            v-for="(address, index) in addresses"
            :key="address.address"
            :to="`/addresses/${address.address}`"
            class="address-panel border-gradient glass-card animate-in"
            :class="`stagger-${Math.min(index + 1, 10)}`"
          >
            <div class="panel-glow"></div>

            <div class="panel-header">
              <div class="header-main">
                <span class="addr-label">ADDR</span>
                <div class="addr-hash-display">
                  <span class="hash-segment mono">{{ address.address.substring(0, 8) }}</span>
                  <span class="hash-ellipsis">•••</span>
                  <span class="hash-segment mono">{{ address.address.substring(address.address.length - 6) }}</span>
                </div>
              </div>
              <div class="header-badge">
                <span v-if="address.isContract" class="type-pill contract">CONTRACT</span>
                <span v-else class="type-pill eoa">EOA</span>
              </div>
            </div>

            <div class="panel-body">
              <div class="data-row balance-row">
                <div class="row-label-group">
                  <span class="row-label">BALANCE</span>
                  <span class="row-value mono">{{ formatWei(address.balance) }}</span>
                  <span class="row-unit">ETH</span>
                </div>
                <div class="balance-visual">
                  <div class="balance-track">
                    <div
                      class="balance-fill"
                      :style="{ width: getBalanceWidth(address.balance) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="data-metrics">
                <div class="metric-box">
                  <span class="metric-label">TRANSACTIONS</span>
                  <span class="metric-value mono">{{ address.transactionCount || 0 }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">LAST SEEN</span>
                  <span class="metric-value mono">{{ address.lastSeenAt ? format(new Date(address.lastSeenAt), 'HH:mm') : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="panel-footer">
              <div class="footer-line"></div>
            </div>
          </RouterLink>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button
            class="pagination-button"
            :disabled="page === 1"
            @click="goToPrevPage"
          >
            Previous
          </button>

          <span class="pagination-info">
            Page <span class="mono">{{ page }}</span> of <span class="mono">{{ totalPages }}</span>
          </span>

          <button
            class="pagination-button"
            :disabled="page === totalPages"
            @click="goToNextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.addresses-page {
  padding: $spacing-lg 0;
  min-height: 100vh;

  @include respond-to(md) {
    padding: $spacing-xl 0;
  }

  @include respond-to(lg) {
    padding: $spacing-2xl 0;
  }
}

.page-header {
  margin-bottom: $spacing-3xl;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: $spacing-xl;
}

.header-content {
  flex: 1;
  min-width: 280px;
}

.page-title {
  font-size: $font-size-2xl;

  @include respond-to(md) {
    font-size: $font-size-3xl;
  }

  @include respond-to(lg) {
    font-size: $font-size-4xl;
  }
  margin: 0 0 $spacing-sm;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.page-description {
  color: $color-text-muted;
  margin: 0;
  font-size: $font-size-base;
}

.header-stats {
  display: flex;
  gap: $spacing-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: $color-text-muted;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.stat-value {
  font-size: $font-size-xl;
  color: $color-text-primary;
  font-weight: 600;
}

.addresses-content {
  width: 100%;
}

.address-mosaic {
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

.address-panel {
  position: relative;
  padding: $spacing-xl;
  text-decoration: none;
  color: $color-text-primary;
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 200px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.015);
    box-shadow:
      0 16px 48px rgba(255, 255, 255, 0.1),
      inset 0 0 80px rgba(255, 255, 255, 0.02);

    .panel-glow {
      opacity: 0.5;
      transform: scale(1.3);
    }

    .balance-fill {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }

    .footer-line {
      width: 100%;
    }
  }
}

.panel-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  opacity: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-lg;
  gap: $spacing-md;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.addr-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.15em;
  font-weight: 600;
}

.addr-hash-display {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hash-segment {
  font-size: 16px;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: -0.01em;
}

.hash-ellipsis {
  font-size: 14px;
  color: $color-text-muted;
  font-weight: 700;
}

.header-badge {
  display: flex;
  align-items: center;
}

.type-pill {
  padding: 4px 10px;
  border-radius: 6px;
  font-family: $font-family-mono;
  font-size: 9px;
  letter-spacing: 0.08em;
  font-weight: 600;

  &.contract {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: $color-text-primary;
  }

  &.eoa {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: $color-text-muted;
  }
}

.panel-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.data-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.row-label-group {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.row-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.row-value {
  font-size: 20px;
  font-weight: 700;
  color: $color-text-primary;
}

.row-unit {
  font-size: 12px;
  color: $color-text-secondary;
  font-weight: 500;
}

.balance-visual {
  width: 100%;
}

.balance-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.balance-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 3px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

.data-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.metric-label {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: $color-text-secondary;
}

.panel-footer {
  margin-top: auto;
  padding-top: $spacing-md;
  position: relative;
}

.footer-line {
  height: 1px;
  width: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xl;
  padding: $spacing-xl 0;
  margin-top: $spacing-2xl;
}

.pagination-button {
  padding: $spacing-sm $spacing-lg;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: $color-text-primary;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: $font-size-sm;
  font-weight: 500;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.pagination-info {
  color: $color-text-secondary;
  font-size: $font-size-sm;
}
</style>
