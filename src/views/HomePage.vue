<script setup lang="ts">
import StatsOverview from '@/components/dashboard/StatsOverview.vue'
import LatestBlocks from '@/components/blocks/LatestBlocks.vue'
import LatestTransactions from '@/components/transactions/LatestTransactions.vue'
import UserGrowth from '@/components/dashboard/UserGrowth.vue'
</script>

<template>
  <div class="home-page">
    <section class="stats-section">
      <div class="container">
        <StatsOverview />
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <div class="content-column">
            <LatestBlocks />
          </div>
          <div class="content-column">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </section>

    <section class="analytics-section">
      <div class="container">
        <UserGrowth />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

.stats-section {
  padding: $spacing-xl 0;

  @include respond-to(md) {
    padding: $spacing-2xl 0;
  }

  @include respond-to(lg) {
    padding: $spacing-3xl 0;
  }
}

.content-section {
  padding: $spacing-lg 0 $spacing-xl 0;

  @include respond-to(md) {
    padding: $spacing-xl 0 $spacing-2xl 0;
  }

  @include respond-to(lg) {
    padding: $spacing-2xl 0 $spacing-3xl 0;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;

  @include respond-to(md) {
    gap: $spacing-xl;
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.content-column {
  animation: slideInUp 0.8s ease;
}

.analytics-section {
  padding: 0 0 $spacing-lg 0;

  @include respond-to(md) {
    padding: 0 0 $spacing-xl 0;
  }

  @include respond-to(lg) {
    padding: 0 0 $spacing-2xl 0;
  }
}
</style>
