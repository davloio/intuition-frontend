<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useFetchTransactionDetail } from '@/composables/useTransactions'
import { formatWei, formatDateTime, getTransactionStatus } from '@/utils/formatters'
import CopyableValue from '@/components/common/CopyableValue.vue'
import CopyIcon from '@/components/common/CopyIcon.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const txHash = computed(() => route.params.hash as string)

const { transactionDetail, loading, error } = useFetchTransactionDetail(txHash.value)

const copiedAddress = ref<string | null>(null)

const handleCopyAddress = async (eventOrAddress: Event | string, address?: string) => {
  const addressToCopy = typeof eventOrAddress === 'string' ? eventOrAddress : address!
  
  if (eventOrAddress instanceof Event) {
    eventOrAddress.preventDefault()
    eventOrAddress.stopPropagation()
  }
  
  try {
    await navigator.clipboard.writeText(addressToCopy)
    copiedAddress.value = addressToCopy
    
    setTimeout(() => {
      copiedAddress.value = null
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const isCopied = (address: string) => {
  return copiedAddress.value === address
}

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
      <RouterLink to="/transactions" class="back-link">
        ← Back to Transactions
      </RouterLink>

      <div class="page-header">
        <h1>Transaction Details</h1>
        <p class="page-description">Complete transaction information</p>
      </div>

      <LoadingSpinner v-if="loading" />

      <ErrorMessage v-else-if="error" :message="error" />

      <div v-else-if="transactionDetail" class="transaction-details">
        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-INFO</span>
            <span v-if="statusInfo" class="status-badge" :class="`status-${statusInfo.color}`">
              {{ statusInfo.text }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Transaction Hash</span>
            <div class="hash-value-row">
              <span class="detail-value mono hash-full">{{ txHash }}</span>
              <CopyIcon 
                :copied="isCopied(txHash)" 
                @copy="handleCopyAddress(txHash)" 
              />
            </div>
          </div>

          <div class="detail-row">
            <span class="detail-label">Block Number</span>
            <RouterLink :to="`/blocks/${transactionDetail.blockNumber}`" class="detail-value mono link-value">
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
              <CopyIcon 
                :copied="isCopied(transactionDetail.fromAddress)" 
                @copy="handleCopyAddress(transactionDetail.fromAddress)" 
              />
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
              <CopyIcon 
                :copied="isCopied(transactionDetail.toAddress)" 
                @copy="handleCopyAddress(transactionDetail.toAddress)" 
              />
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
              <CopyIcon 
                :copied="isCopied(transactionDetail.contractAddress)" 
                @copy="handleCopyAddress(transactionDetail.contractAddress)" 
              />
            </div>
          </RouterLink>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-VALUE</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Value (ETH)</span>
            <span class="detail-value mono">{{ formattedValue.eth }} ETH</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Value (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedValue.wei }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Transaction Fee (ETH)</span>
            <span class="detail-value mono">{{ formattedFee.eth }} ETH</span>
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

          <div class="detail-row" v-if="transactionDetail.gasUsed !== undefined">
            <span class="detail-label">Gas Used</span>
            <span class="detail-value mono">{{ transactionDetail.gasUsed.toLocaleString() }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.gasPrice">
            <span class="detail-label">Gas Price</span>
            <span class="detail-value mono">{{ transactionDetail.gasPrice }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.effectiveGasPrice">
            <span class="detail-label">Effective Gas Price</span>
            <span class="detail-value mono">{{ transactionDetail.effectiveGasPrice }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.maxFeePerGas">
            <span class="detail-label">Max Fee Per Gas</span>
            <span class="detail-value mono">{{ transactionDetail.maxFeePerGas }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.maxPriorityFeePerGas">
            <span class="detail-label">Max Priority Fee Per Gas</span>
            <span class="detail-value mono">{{ transactionDetail.maxPriorityFeePerGas }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.cumulativeGasUsed !== undefined">
            <span class="detail-label">Cumulative Gas Used</span>
            <span class="detail-value mono">{{ transactionDetail.cumulativeGasUsed.toLocaleString() }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">TXN-METADATA</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.nonce !== undefined">
            <span class="detail-label">Nonce</span>
            <span class="detail-value mono">{{ transactionDetail.nonce }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.transactionType !== undefined">
            <span class="detail-label">Transaction Type</span>
            <span class="detail-value mono">{{ transactionDetail.transactionType }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.methodId">
            <span class="detail-label">Method ID</span>
            <span class="detail-value mono">{{ transactionDetail.methodId }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.logsCount !== undefined">
            <span class="detail-label">Logs Count</span>
            <span class="detail-value mono">{{ transactionDetail.logsCount }}</span>
          </div>

          <div class="detail-row" v-if="transactionDetail.isBridgeTransaction">
            <span class="detail-label">Bridge Transaction</span>
            <span class="detail-value">
              <span class="bridge-badge">{{ transactionDetail.bridgeDirection || 'Yes' }}</span>
            </span>
          </div>

          <div class="detail-row" v-if="transactionDetail.inputData">
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

  &:last-child {
    border-bottom: none;
  }

  &.address-row {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    cursor: pointer;
    margin: 0 (-$spacing-md);
    padding: 6px $spacing-md;
    border-radius: 6px;

    @include respond-to(md) {
      margin: 0 (-$spacing-lg);
      padding: 6px $spacing-lg;
    }

    @include respond-to(lg) {
      margin: 0 (-$spacing-xl);
      padding: 6px $spacing-xl;
    }

    &:hover {
      transform: translateY(-2px);
      background: $color-bg-card-hover;
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

.address-value-row,
.hash-value-row {
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
