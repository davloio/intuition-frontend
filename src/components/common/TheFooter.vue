<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-box">
        <div class="large-text">INTUITION</div>
        
        <div class="footer-grid">
          <div class="grid-section section-nav">
            <div class="section-code">FTR-01</div>
            <nav class="nav-group">
              <RouterLink to="/" class="nav-link">Home</RouterLink>
              <RouterLink to="/blocks" class="nav-link">Blocks</RouterLink>
              <RouterLink to="/transactions" class="nav-link">Transactions</RouterLink>
            </nav>
          </div>

          <div class="grid-section section-external">
            <div class="section-code">FTR-02</div>
            <nav class="nav-group">
              <a href="https://intuition.systems" target="_blank" rel="noopener noreferrer" class="nav-link">
                Intuition Systems
              </a>
              <a href="https://github.com/davloio" target="_blank" rel="noopener noreferrer" class="nav-link">
                GitHub
              </a>
            </nav>
          </div>

          <div class="grid-section section-info">
            <div class="section-code">FTR-03</div>
            <p class="info-text">
              Next generation blockchain explorer for Intuition Systems.
              Built with precision and clarity.
            </p>
          </div>

          <div class="grid-section section-credits">
            <div class="credits-text">
              © {{ currentYear }} INTUITION EXPLORER
            </div>
            <a href="https://davlo.io" target="_blank" rel="noopener noreferrer" class="credits-link">
              <img src="https://avatars.githubusercontent.com/u/240302687?s=32&v=4" alt="davlo.io" class="credits-favicon" />
              davlo.io
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: transparent;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  padding: 0 0 $spacing-xs;

  @include respond-to(md) {
    padding: 0 0 $spacing-xs;
  }
}

.footer-box {
  position: relative;
  min-height: 180px;
  padding: $spacing-lg $spacing-md;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 1px 2px rgba(255, 255, 255, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.15),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @include respond-to(md) {
    padding: $spacing-xl;
    min-height: 200px;
  }

  @include respond-to(lg) {
    padding: $spacing-xl;
    min-height: 180px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.0) 100%
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.large-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: $font-family-primary;
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: $color-text-primary;
  user-select: none;
  opacity: 0.03;
  white-space: nowrap;
  pointer-events: none;

  @include respond-to(lg) {
    font-size: clamp(3rem, 8vw, 6rem);
  }
}

.footer-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  height: 100%;

  @include respond-to(md) {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto 1fr auto;
    gap: $spacing-sm $spacing-md;
  }
}

.grid-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.section-code {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $color-text-secondary;
  opacity: 0.5;
  margin-bottom: 0;
}

.section-nav {
  @include respond-to(md) {
    grid-column: 1 / 4;
    grid-row: 1;
  }
}

.section-external {
  @include respond-to(md) {
    grid-column: 1 / 4;
    grid-row: 2;
  }
}

.section-info {
  @include respond-to(md) {
    grid-column: 10 / 13;
    grid-row: 1 / 3;
    justify-content: flex-start;
  }
}

.section-credits {
  @include respond-to(md) {
    grid-column: 1 / 13;
    grid-row: 3;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: $spacing-sm;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: auto;
  }
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.nav-link {
  font-size: $font-size-base;
  font-weight: 400;
  color: $color-text-secondary;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: fit-content;
  position: relative;
  padding-left: 0;

  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%) scaleX(0);
    width: 6px;
    height: 1px;
    background: $color-text-primary;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover {
    color: $color-text-primary;
    padding-left: 16px;

    &::before {
      transform: translateY(-50%) scaleX(1);
    }
  }

  &.router-link-active {
    color: $color-text-primary;
    font-weight: 500;
  }
}

.info-text {
  font-size: $font-size-sm;
  line-height: 1.7;
  color: $color-text-muted;
  margin: 0;
  max-width: 280px;
}

.credits-text {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  color: $color-text-muted;
  letter-spacing: 0.05em;
}

.credits-link {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  color: $color-text-secondary;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: $color-text-primary;
  }
}

.credits-favicon {
  width: 14px;
  height: 14px;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  .credits-link:hover & {
    opacity: 1;
  }
}
</style>