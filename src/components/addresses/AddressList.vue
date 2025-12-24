<script setup lang="ts">
import { computed } from 'vue'
import AddressCard from './AddressCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useAddresses } from '@/composables/useAddresses'

const props = defineProps<{
  limit?: number
  offset?: number
}>()

const { addresses, loading, error } = useAddresses(
  props.limit || 10,
  props.offset || 0
)

const displayedAddresses = computed(() => addresses.value.slice(0, props.limit || 10))
</script>

<template>
  <div class="address-list">
    <LoadingSpinner v-if="loading" />

    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else-if="displayedAddresses.length > 0" class="address-grid">
      <AddressCard
        v-for="(address, index) in displayedAddresses"
        :key="address.address"
        :address="address"
        :class="`stagger-${Math.min(index + 1, 10)}`"
      />
    </div>

    <div v-else class="empty-state">
      <p>No addresses found</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.address-list {
  width: 100%;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-3xl;
  color: $color-text-muted;
  font-size: $font-size-lg;
}
</style>
