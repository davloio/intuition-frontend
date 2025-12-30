<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAddresses } from '@/composables/useAddresses'
import { formatWei, truncateAddress } from '@/utils/formatters'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { addresses, loading } = useAddresses(10, 0)
const displayedAddresses = computed(() => addresses.value)
</script>

<template>
  <div class="latest-addresses">
    <div class="addresses-header">
      <h2>Latest Addresses</h2>
      <RouterLink to="/addresses" class="view-all-link">
        View All
      </RouterLink>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="addresses-container">
      <RouterLink
        v-for="address in displayedAddresses"
        :key="address.address"
        :to="`/addresses/${address.address}`"
        class="address-item border-gradient glass-card animate-in"
      >
        <div class="address-main">
          <div class="address-type">
            <span class="type-code">ADDR</span>
            <span v-if="address.isContract" class="contract-indicator">CONTRACT</span>
          </div>
          <div class="address-hash mono">{{ truncateAddress(address.address, 12, 10) }}</div>
        </div>

        <div class="address-info">
          <div class="info-item">
            <span class="info-label">Balance</span>
            <span class="info-value mono">{{ formatWei(address.balance) }} TRUST</span>
          </div>
          <div class="info-item">
            <span class="info-label">Txns</span>
            <span class="info-value mono">{{ address.transactionCount || 0 }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.latest-addresses {
  width: 100%;
}

.addresses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
}

h2 {
  font-size: $font-size-xl;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

.view-all-link {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-primary;
  }
}

.addresses-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.address-item {
  padding: $spacing-lg;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: $color-hover-overlay;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
}

.address-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.address-type {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.type-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.contract-indicator {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: $font-family-mono;
  font-size: 9px;
  color: $color-text-secondary;
  letter-spacing: 0.05em;
}

.address-hash {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-primary;
}

.address-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.info-value {
  font-size: $font-size-sm;
  color: $color-text-primary;
  font-weight: 500;
}
</style>
