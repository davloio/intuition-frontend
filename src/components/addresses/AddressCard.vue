<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Address } from '@/types/address'
import { formatWei, truncateAddress, formatDateTime } from '@/utils/formatters'

const props = defineProps<{
  address: Address
}>()

const totalTransactions = computed(() => {
  return props.address.transactionCount || 0
})

const formattedBalance = computed(() => {
  return formatWei(props.address.balance)
})

const truncated = computed(() => {
  return truncateAddress(props.address.address, 10, 8)
})

const lastSeen = computed(() => {
  if (!props.address.lastSeenAt) return 'N/A'
  return formatDateTime(props.address.lastSeenAt)
})
</script>

<template>
  <RouterLink
    :to="`/addresses/${address.address}`"
    class="address-card border-gradient glass-card animate-in"
  >
    <div class="address-header">
      <span class="address-code">ADDR</span>
      <span v-if="address.isContract" class="contract-badge">CONTRACT</span>
    </div>

    <div class="address-hash mono">{{ truncated }}</div>

    <div class="address-details">
      <div class="detail-item">
        <span class="detail-label">Balance</span>
        <span class="detail-value mono">{{ formattedBalance }} ETH</span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Txns</span>
        <span class="detail-value mono">{{ totalTransactions }}</span>
      </div>
    </div>

    <div class="address-footer">
      <span class="footer-label">Last Seen</span>
      <span class="footer-value">{{ lastSeen }}</span>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.address-card {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.08);
  }
}

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
}

.address-code {
  font-family: $font-family-mono;
  font-size: 10px;
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
}

.address-hash {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: -0.01em;
}

.address-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: $color-text-muted;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: $font-size-sm;
  color: $color-text-primary;
  font-weight: 500;
}

.address-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-label {
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.footer-value {
  font-size: 11px;
  color: $color-text-secondary;
  font-weight: 400;
}
</style>
