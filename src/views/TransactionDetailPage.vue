<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import CopyableValue from '@/components/common/CopyableValue.vue'

const route = useRoute()
const txHash = computed(() => route.params.hash as string)
</script>

<template>
  <div class="transaction-detail-page">
    <div class="container">
      <RouterLink to="/transactions" class="back-link">
        ← Back to Transactions
      </RouterLink>

      <div class="page-header">
        <h1>Transaction Details</h1>
        <p class="page-description">Transaction metadata</p>
      </div>

      <div class="detail-card border-gradient glass-card">
        <div class="detail-header">
          <span class="detail-code">TXN-INFO</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Transaction Hash</span>
          <CopyableValue :value="txHash" value-class="detail-value mono hash-full" />
        </div>

        <div class="info-box">
          <p class="info-text">
            This API provides transaction metadata only. For full transaction details
            including addresses, values, and status, please use the Intuition blockchain
            explorer.
          </p>
          <p class="info-link">
            View on Intuition Explorer:
            <a
              :href="`https://intuition.calderaexplorer.xyz/tx/${txHash}`"
              target="_blank"
              rel="noopener"
              class="external-link"
            >
              intuition.calderaexplorer.xyz ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.transaction-detail-page {
  padding: $spacing-lg 0;
  min-height: 100vh;

  @include respond-to(md) {
    padding: $spacing-xl 0;
  }

  @include respond-to(lg) {
    padding: $spacing-2xl 0;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  color: $color-text-secondary;
  text-decoration: none;
  font-size: $font-size-sm;
  margin-bottom: $spacing-xl;
  transition: all 0.2s ease;

  &:hover {
    color: $color-primary;
    transform: translateX(-4px);
  }
}

.page-header {
  margin-bottom: $spacing-lg;

  @include respond-to(md) {
    margin-bottom: $spacing-xl;
  }

  @include respond-to(lg) {
    margin-bottom: $spacing-2xl;
  }

  h1 {
    font-size: $font-size-2xl;

    @include respond-to(md) {
      font-size: $font-size-3xl;
    }

    @include respond-to(lg) {
      font-size: $font-size-4xl;
    }
    margin: 0 0 $spacing-sm 0;
  }

  .page-description {
    color: $color-text-secondary;
    font-size: $font-size-base;
    margin: 0;
  }
}

.detail-card {
  padding: $spacing-md;

  @include respond-to(md) {
    padding: $spacing-lg;
  }

  @include respond-to(lg) {
    padding: $spacing-xl;
  }
  border-radius: $border-radius-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.detail-header {
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-code {
  font-family: $font-family-mono;
  font-size: 10px;
  color: $color-text-muted;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding: $spacing-md 0;
  font-size: $font-size-sm;
}

.detail-label {
  color: $color-text-secondary;
  font-weight: 500;
  font-size: $font-size-xs;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  color: $color-text-primary;
  font-weight: 500;

  &.hash-full {
    word-break: break-all;
    font-size: $font-size-sm;
  }
}

.info-box {
  margin-top: $spacing-md;
  padding: $spacing-lg;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $border-radius-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-text {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  line-height: 1.6;
  margin: 0;
}

.info-link {
  color: $color-text-muted;
  font-size: $font-size-sm;
  margin: 0;
}

.external-link {
  color: $color-text-primary;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  margin-left: $spacing-xs;

  &:hover {
    color: $color-primary;
  }
}
</style>
