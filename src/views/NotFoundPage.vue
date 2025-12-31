<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code gradient-text">
          404
        </div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <RouterLink
          to="/"
          class="btn-primary"
        >
          Go to Homepage
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl 0;
}

.not-found-content {
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: $spacing-lg;

  @include respond-to(md) {
    font-size: 12rem;
  }
}

h1 {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-md;
}

p {
  color: $color-text-secondary;
  font-size: $font-size-lg;
  margin-bottom: $spacing-2xl;
}

.btn-primary {
  display: inline-block;
  text-decoration: none;
}
</style>
