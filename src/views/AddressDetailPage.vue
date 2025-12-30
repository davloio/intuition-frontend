<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useFetchAddressDetail } from '@/composables/useAddresses'
import { useTransactions } from '@/composables/useTransactions'
import { formatWei, formatDateTime, truncateHash } from '@/utils/formatters'
import CopyableValue from '@/components/common/CopyableValue.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const addressHash = computed(() => route.params.address as string)

const page = ref(1)
const pageSize = 20
const offset = computed(() => (page.value - 1) * pageSize)

const { addressDetail, loading: addressLoading, error: addressError } = useFetchAddressDetail(addressHash)
const { transactions, totalCount, loading: txLoading, error: txError, refetch } = useTransactions(
  pageSize,
  offset.value,
  undefined,
  addressHash
)

const loading = computed(() => addressLoading.value || txLoading.value)
const error = computed(() => addressError.value || txError.value)

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

watch(page, async (newPage) => {
  const newOffset = (newPage - 1) * pageSize
  await refetch(pageSize, newOffset, undefined, addressHash.value)
  window.scrollTo({ top: 400, behavior: 'smooth' })
})

const formattedBalance = computed(() => {
  if (!addressDetail.value?.balance) return { wei: '0', eth: '0' }
  return {
    wei: addressDetail.value.balance,
    eth: formatWei(addressDetail.value.balance)
  }
})

const formattedTotalSent = computed(() => {
  if (!addressDetail.value?.totalSent) return { wei: '0', eth: '0' }
  return {
    wei: addressDetail.value.totalSent,
    eth: formatWei(addressDetail.value.totalSent)
  }
})

const formattedTotalReceived = computed(() => {
  if (!addressDetail.value?.totalReceived) return { wei: '0', eth: '0' }
  return {
    wei: addressDetail.value.totalReceived,
    eth: formatWei(addressDetail.value.totalReceived)
  }
})

const goToNextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
  }
}

const goToPrevPage = () => {
  if (page.value > 1) {
    page.value--
  }
}
</script>

<template>
  <div class="address-detail-page">
    <div class="container">
      <RouterLink to="/addresses" class="back-link">
        ← Back to Addresses
      </RouterLink>

      <div class="page-header">
        <h1>Address Details</h1>
        <p class="page-description">Complete address information and transaction history</p>
      </div>

      <LoadingSpinner v-if="loading && !addressDetail" />

      <ErrorMessage v-else-if="error" :message="error" />

      <div v-else-if="addressDetail" class="address-details">
        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">ADDR-INFO</span>
            <span v-if="addressDetail.isContract" class="contract-badge">CONTRACT</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Address</span>
            <CopyableValue :value="addressHash" value-class="detail-value mono hash-full" />
          </div>

          <div class="detail-row">
            <span class="detail-label">First Seen Block</span>
            <RouterLink :to="`/blocks/${addressDetail.firstSeenBlock}`" class="detail-value mono link-value">
              {{ addressDetail.firstSeenBlock }}
            </RouterLink>
          </div>

          <div class="detail-row">
            <span class="detail-label">Last Seen Block</span>
            <RouterLink :to="`/blocks/${addressDetail.lastSeenBlock}`" class="detail-value mono link-value">
              {{ addressDetail.lastSeenBlock }}
            </RouterLink>
          </div>

          <div class="detail-row">
            <span class="detail-label">First Seen At</span>
            <span class="detail-value">{{ formatDateTime(addressDetail.createdAt) }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Last Updated At</span>
            <span class="detail-value">{{ formatDateTime(addressDetail.updatedAt) }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">ADDR-BALANCE</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Balance (TRUST)</span>
            <span class="detail-value mono">{{ formattedBalance.eth }} TRUST</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Balance (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedBalance.wei }}</span>
          </div>
        </div>

        <div class="detail-card border-gradient glass-card">
          <div class="detail-header">
            <span class="detail-code">ADDR-ACTIVITY</span>
          </div>

          <div class="detail-row" v-if="addressDetail.transactionCountOut !== undefined">
            <span class="detail-label">Transactions Out</span>
            <span class="detail-value mono">{{ addressDetail.transactionCountOut.toLocaleString() }}</span>
          </div>

          <div class="detail-row" v-if="addressDetail.transactionCountIn !== undefined">
            <span class="detail-label">Transactions In</span>
            <span class="detail-value mono">{{ addressDetail.transactionCountIn.toLocaleString() }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Total Sent (TRUST)</span>
            <span class="detail-value mono">{{ formattedTotalSent.eth }} TRUST</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Total Sent (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedTotalSent.wei }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Total Received (TRUST)</span>
            <span class="detail-value mono">{{ formattedTotalReceived.eth }} TRUST</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Total Received (Wei)</span>
            <span class="detail-value mono small-text">{{ formattedTotalReceived.wei }}</span>
          </div>
        </div>

        <div class="transactions-section">
          <div class="section-header">
            <h2>Transaction History</h2>
            <span class="transaction-count mono">{{ totalCount.toLocaleString() }} total</span>
          </div>

          <LoadingSpinner v-if="txLoading" />

          <ErrorMessage v-else-if="txError" :message="txError" />

          <div v-else-if="transactions.length > 0" class="transactions-list">
            <RouterLink
              v-for="tx in transactions"
              :key="tx.hash"
              :to="`/transactions/${tx.hash}`"
              class="transaction-item border-gradient glass-card"
            >
              <div class="tx-header">
                <span class="tx-code">TXN</span>
                <span class="tx-block mono">Block {{ tx.blockNumber }}</span>
              </div>

              <div class="tx-hash mono">{{ truncateHash(tx.hash, 12, 10) }}</div>

              <div class="tx-details">
                <div class="tx-detail">
                  <span class="tx-label">Position</span>
                  <span class="tx-value mono">{{ tx.position }}</span>
                </div>
                <div class="tx-detail">
                  <span class="tx-label">Time</span>
                  <span class="tx-value">{{ formatDateTime(tx.createdAt) }}</span>
                </div>
              </div>
            </RouterLink>

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

          <div v-else class="empty-state">
            <p>No transactions found for this address</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.address-detail-page {
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

.address-details {
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

.contract-badge {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-secondary;
  letter-spacing: 0.05em;
  font-weight: 600;

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.06);
  }
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
}

.link-value {
  color: $color-text-primary;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-secondary;
  }
}

.transactions-section {
  margin-top: $spacing-md;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;

  h2 {
    font-size: $font-size-lg;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .transaction-count {
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.transaction-item {
  padding: $spacing-md;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.06);
  }
}

.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tx-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.tx-block {
  font-size: 11px;
  color: $color-text-secondary;
}

.tx-hash {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-primary;
}

.tx-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme="light"] & {
    border-top-color: rgba(0, 0, 0, 0.06);
  }
}

.tx-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tx-label {
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.tx-value {
  font-size: $font-size-sm;
  color: $color-text-primary;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xl;
  padding: $spacing-xl 0;
  margin-top: $spacing-lg;
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

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.05);
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.04);
      border-color: rgba(0, 0, 0, 0.08);
    }
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

.empty-state {
  text-align: center;
  padding: $spacing-3xl;
  color: $color-text-muted;
  font-size: $font-size-base;
}
</style>
