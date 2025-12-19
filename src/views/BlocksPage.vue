<script setup lang="ts">
import BlockList from '@/components/blocks/BlockList.vue'
</script>

<template>
  <div class="blocks-page">
    <div class="container">
      <div class="page-header">
        <h1>Blocks</h1>
        <p class="page-description">
          Explore the latest blocks on the Intuition blockchain
        </p>
      </div>

      <BlockList />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blocks-page {
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
    font-size: $font-size-lg;
    margin: 0;
  }
}
</style>
