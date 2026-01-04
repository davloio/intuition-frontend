<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useFetchTransactionDetail } from '@/composables/useTransactions'
import { formatWei, formatDateTime, getTransactionStatus } from '@/utils/formatters'
import CopyableValue from '@/components/common/CopyableValue.vue'
import CopyIcon from '@/components/common/CopyIcon.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const txHash = computed(() => route.params.hash as string)

const { transactionDetail, loading, error } = useFetchTransactionDetail(txHash)


const statusInfo = computed(() => {
  if (!transactionDetail.value) return null
  return getTransactionStatus(transactionDetail.value.status)
})

const formattedValue = computed(() => {
  if (!transactionDetail.value?.value) return { wei: '0', eth: '0' }
  return {
    wei: transactionDetail.value.value,
    eth: formatWei(transactionDetail.value.value)
  }
})

const formattedFee = computed(() => {
  if (!transactionDetail.value?.transactionFee) return { wei: '0', eth: '0' }
  return {
    wei: transactionDetail.value.transactionFee,
    eth: formatWei(transactionDetail.value.transactionFee)
  }
})
</script>

<template>
  <div class="transaction-detail-page">
    <div class="container">
      <RouterLink
        to="/transactions"
        class="back-link"
      >
        ← Back to Transactions
      </RouterLink>

      <div class="page-header">
        <h1>Transaction Details</h1>
        <p class="page-description">
          Complete transaction information
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <ErrorMessage
        v-else-if="error"
        :message="error"
      />

      <div
        v-else-if="transactionDetail"
        class="transaction-details"
      >
        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-INFO</span>
            <span
              v-if="statusInfo"
              class="status-badge"
              :class="`status-${statusInfo.color}`"
            >
              {{ statusInfo.text }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Transaction Hash</span>
            <CopyableValue
              :value="txHash"
              value-class="detail-value mono hash-full"
            />
          </div>

          <div class="detail-row">
            <span class="detail-label">Block Number</span>
            <RouterLink
              :to="`/blocks/${transactionDetail.blockNumber}`"
              class="detail-value mono link-value"
            >
              {{ transactionDetail.blockNumber }}
            </RouterLink>
          </div>

          <div class="detail-row">
            <span class="detail-label">Position in Block</span>
            <span class="detail-value mono">{{ transactionDetail.position }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Timestamp</span>
            <span class="detail-value">{{ formatDateTime(transactionDetail.createdAt) }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-ADDRESSES</span>
          </div>

          <RouterLink
            v-if="transactionDetail.fromAddress"
            :to="`/addresses/${transactionDetail.fromAddress}`"
            class="detail-row address-row"
          >
            <span class="detail-label">From</span>
            <div class="address-value-row">
              <span class="detail-value mono address-link">
                {{ transactionDetail.fromAddress }}
              </span>
              <CopyIcon :value="transactionDetail.fromAddress" />
            </div>
          </RouterLink>

          <RouterLink
            v-if="transactionDetail.toAddress"
            :to="`/addresses/${transactionDetail.toAddress}`"
            class="detail-row address-row"
          >
            <span class="detail-label">To</span>
            <div class="address-value-row">
              <span class="detail-value mono address-link">
                {{ transactionDetail.toAddress }}
              </span>
              <CopyIcon :value="transactionDetail.toAddress" />
            </div>
          </RouterLink>

          <RouterLink
            v-if="transactionDetail.contractAddress"
            :to="`/addresses/${transactionDetail.contractAddress}`" 
            class="detail-row address-row"
          >
            <span class="detail-label">Contract Address</span>
            <div class="address-value-row">
              <span class="detail-value mono address-link">
                {{ transactionDetail.contractAddress }}
              </span>
              <CopyIcon :value="transactionDetail.contractAddress" />
            </div>
          </RouterLink>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-VALUE</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Value (TRUST)</span>
            <span class="detail-value mono">{{ formattedValue.eth }} TRUST</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Value (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedValue.wei }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Transaction Fee (TRUST)</span>
            <span class="detail-value mono">{{ formattedFee.eth }} TRUST</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Transaction Fee (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedFee.wei }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-GAS</span>
          </div>

          <div
            v-if="transactionDetail.gasUsed !== undefined"
            class="detail-row"
          >
            <span class="detail-label">Gas Used</span>
            <span class="detail-value mono">{{ transactionDetail.gasUsed.toLocaleString() }}</span>
          </div>

          <div
            v-if="transactionDetail.gasPrice"
            class="detail-row"
          >
            <span class="detail-label">Gas Price (Wei)</span>
            <span class="detail-value mono small-text">{{ transactionDetail.gasPrice }}</span>
          </div>

          <div
            v-if="transactionDetail.effectiveGasPrice"
            class="detail-row"
          >
            <span class="detail-label">Effective Gas Price (Wei)</span>
            <span class="detail-value mono small-text">{{ transactionDetail.effectiveGasPrice }}</span>
          </div>

          <div
            v-if="transactionDetail.maxFeePerGas"
            class="detail-row"
          >
            <span class="detail-label">Max Fee Per Gas (Wei)</span>
            <span class="detail-value mono small-text">{{ transactionDetail.maxFeePerGas }}</span>
          </div>

          <div
            v-if="transactionDetail.maxPriorityFeePerGas"
            class="detail-row"
          >
            <span class="detail-label">Max Priority Fee Per Gas (Wei)</span>
            <span class="detail-value mono small-text">{{ transactionDetail.maxPriorityFeePerGas }}</span>
          </div>

          <div
            v-if="transactionDetail.cumulativeGasUsed !== undefined"
            class="detail-row"
          >
            <span class="detail-label">Cumulative Gas Used</span>
            <span class="detail-value mono">{{ transactionDetail.cumulativeGasUsed.toLocaleString() }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-METADATA</span>
          </div>

          <div
            v-if="transactionDetail.nonce !== undefined"
            class="detail-row"
          >
            <span class="detail-label">Nonce</span>
            <span class="detail-value mono">{{ transactionDetail.nonce }}</span>
          </div>

          <div
            v-if="transactionDetail.transactionType !== undefined"
            class="detail-row"
          >
            <span class="detail-label">Transaction Type</span>
            <span class="detail-value mono">{{ transactionDetail.transactionType }}</span>
          </div>

          <div
            v-if="transactionDetail.methodId"
            class="detail-row"
          >
            <span class="detail-label">Method ID</span>
            <span class="detail-value mono">{{ transactionDetail.methodId }}</span>
          </div>

          <div
            v-if="transactionDetail.logsCount !== undefined"
            class="detail-row"
          >
            <span class="detail-label">Logs Count</span>
            <span class="detail-value mono">{{ transactionDetail.logsCount }}</span>
          </div>

          <div
            v-if="transactionDetail.isBridgeTransaction"
            class="detail-row"
          >
            <span class="detail-label">Bridge Transaction</span>
            <span class="detail-value">
              <span class="bridge-badge">{{ transactionDetail.bridgeDirection || 'Yes' }}</span>
            </span>
          </div>

          <div
            v-if="transactionDetail.inputData"
            class="detail-row"
          >
            <span class="detail-label">Input Data</span>
            <CopyableValue 
              :value="transactionDetail.inputData" 
              value-class="detail-value mono small-text input-data" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.transaction-detail-page {
  padding: $spacing-md 0;
  min-height: 100vh;

  @include respond-to(md) {
    padding: $spacing-lg 0;
  }

  @include respond-to(lg) {
    padding: $spacing-xl 0;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  color: $color-text-secondary;
  text-decoration: none;
  font-size: $font-size-sm;
  margin-bottom: $spacing-md;
  transition: all 0.2s ease;

  &:hover {
    color: $color-text-primary;
    transform: translateX(-4px);
  }
}

.page-header {
  margin-bottom: $spacing-md;

  @include respond-to(md) {
    margin-bottom: $spacing-lg;
  }

  h1 {
    font-size: $font-size-xl;

    @include respond-to(md) {
      font-size: $font-size-2xl;
    }

    @include respond-to(lg) {
      font-size: $font-size-3xl;
    }
    margin: 0 0 $spacing-xs 0;
  }

  .page-description {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin: 0;
  }
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.detail-card {
  padding: $spacing-md;

  @include respond-to(md) {
    padding: $spacing-lg;
  }

  @include respond-to(lg) {
    padding: $spacing-xl;
  }
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-xs;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-bottom-color: rgba(0, 0, 0, 0.04);
  }
}

.detail-code {
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid;

  &.status-green {
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.1);
  }

  &.status-red {
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.1);
  }

  &.status-gray {
    color: $color-text-muted;
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);

    [data-theme="light"] & {
      border-color: rgba(0, 0, 0, 0.06);
      background: rgba(0, 0, 0, 0.03);
    }
  }
}

.bridge-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.1);
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  [data-theme="light"] & {
    border-bottom-color: rgba(0, 0, 0, 0.025);
  }

  &:last-child {
    border-bottom: none;
  }

  &.address-row {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    margin: 0 (-$spacing-md);
    padding: 6px $spacing-md;
    border-radius: 6px;
    position: relative;

    @include respond-to(md) {
      margin: 0 (-$spacing-lg);
      padding: 6px $spacing-lg;
    }

    @include respond-to(lg) {
      margin: 0 (-$spacing-xl);
      padding: 6px $spacing-xl;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: $color-hover-overlay;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    &:hover::before {
      opacity: 1;
    }
  }
}

.detail-label {
  color: $color-text-muted;
  font-weight: 500;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  color: $color-text-primary;
  font-weight: 500;
  font-size: $font-size-sm;

  &.hash-full {
    word-break: break-all;
    font-size: $font-size-sm;
  }

  &.small-text {
    font-size: 11px;
    color: $color-text-secondary;
  }

  &.input-data {
    max-height: 150px;
    overflow-y: auto;
    word-break: break-all;
    padding: $spacing-xs;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.05);
    }
    font-size: 11px;
  }
}

.link-value {
  color: $color-text-primary;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-secondary;
  }
}

.address-value-row {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.address-link,
.hash-full {
  color: $color-text-primary;
  word-break: break-all;
  font-weight: 500;
  font-size: $font-size-sm;
  flex: 1;
}
</style>
