<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SearchModal from './SearchModal.vue'

const mobileMenuOpen = ref(false)
const searchModalOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const openSearchModal = () => {
  searchModalOpen.value = true
}

const closeSearchModal = () => {
  searchModalOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    openSearchModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-wrapper">
        <div class="header-content">
          <RouterLink to="/" class="logo">
            <div class="logo-icon"></div>
            <span class="logo-text">
              INTUITION <span class="logo-text-tech">EXPLORER</span>
            </span>
          </RouterLink>

          <nav class="nav desktop-nav">
            <RouterLink to="/" class="nav-link" data-text="Home">
              <span class="nav-link-inner border-gradient glass-card">Home</span>
            </RouterLink>
            <RouterLink to="/blocks" class="nav-link" data-text="Blocks">
              <span class="nav-link-inner border-gradient glass-card">Blocks</span>
            </RouterLink>
            <RouterLink to="/transactions" class="nav-link" data-text="Transactions">
              <span class="nav-link-inner border-gradient glass-card">Transactions</span>
            </RouterLink>
          </nav>

          <button class="search-button" @click="openSearchModal" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu" :class="{ 'active': mobileMenuOpen }">
          <svg class="toggle-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g class="icon-grid">
              <circle cx="5" cy="5" r="1.5" fill="currentColor" />
              <circle cx="15" cy="5" r="1.5" fill="currentColor" />
              <circle cx="5" cy="15" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1.5" fill="currentColor" />
            </g>
            <line class="icon-line line-h" x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" />
            <line class="icon-line line-v" x1="10" y1="5" x2="10" y2="15" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>


    </div>

    <Teleport to="body">
      <SearchModal v-if="searchModalOpen" @close="closeSearchModal" />
    </Teleport>

    <Teleport to="body">
      <transition name="menu-slide">
        <div v-if="mobileMenuOpen" class="mobile-menu-backdrop" @click="toggleMobileMenu"></div>
      </transition>
      <transition name="panel-slide">
        <div v-if="mobileMenuOpen" class="mobile-menu-panel">
          <div class="panel-grid"></div>
          <div class="panel-diagonal"></div>

          <button class="panel-close" @click="toggleMobileMenu">
            <span class="close-line"></span>
            <span class="close-line"></span>
          </button>

          <div class="panel-header">
            <div class="header-code">NAV</div>
            <div class="header-accent"></div>
          </div>

          <nav class="panel-nav">
            <RouterLink to="/" class="nav-item" @click="toggleMobileMenu">
              <span class="item-num">01</span>
              <span class="item-label">HOME</span>
              <span class="item-bar"></span>
            </RouterLink>
            <RouterLink to="/blocks" class="nav-item" @click="toggleMobileMenu">
              <span class="item-num">02</span>
              <span class="item-label">BLOCKS</span>
              <span class="item-bar"></span>
            </RouterLink>
            <RouterLink to="/transactions" class="nav-item" @click="toggleMobileMenu">
              <span class="item-num">03</span>
              <span class="item-label">TRANSACTIONS</span>
              <span class="item-bar"></span>
            </RouterLink>
          </nav>

          <div class="panel-footer">
            <div class="footer-line"></div>
            <div class="footer-label">INTUITION<br>EXPLORER</div>
          </div>
        </div>
      </transition>
    </Teleport>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: $spacing-md 0;
  background: transparent;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-sm $spacing-md;
  border-radius: 100px;
  max-width: 1200px;
  margin: 0 auto;
  gap: $spacing-md;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 1px 2px rgba(255, 255, 255, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.15),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  position: relative;

  @include respond-to(md) {
    padding: $spacing-md $spacing-lg;
    gap: $spacing-xl;
  }

  @include respond-to(lg) {
    padding: $spacing-md $spacing-lg $spacing-md $spacing-md;
    gap: $spacing-3xl;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 100px;
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

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  text-decoration: none;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    opacity: 0.8;
  }
}

.logo-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid $color-text-primary;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.logo-text {
  font-size: $font-size-base;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: $color-text-primary;
  white-space: nowrap;
}

.logo-text-tech {
  font-family: $font-family-mono;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.nav {
  display: flex;
  gap: $spacing-xl;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;

  .nav-link-inner {
    display: block;
    color: $color-text-secondary;
    font-family: $font-family-primary;
    font-size: $font-size-base;
    font-weight: 500;
    padding: $spacing-xs $spacing-md;
    border-radius: 100px;
    white-space: nowrap;
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.95);
    border: 1px solid transparent;
  }

  &:hover .nav-link-inner {
    color: $color-text-primary;
    opacity: 1;
    transform: scale(1);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.router-link-active .nav-link-inner {
    color: $color-text-primary;
    opacity: 1;
    transform: scale(1);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:active .nav-link-inner {
    border-color: rgba(255, 255, 255, 0.25);
    transform: scale(0.98);
  }

  &::before {
    content: attr(data-text);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-text-secondary;
    font-family: $font-family-primary;
    font-size: $font-size-base;
    font-weight: 500;
    white-space: nowrap;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before,
  &.router-link-active::before {
    opacity: 0;
  }
}

.desktop-nav {
  display: none;

  @include respond-to(lg) {
    display: flex;
  }
}

.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.05);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &.active {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }

  @include respond-to(lg) {
    display: none;
  }
}

.toggle-icon {
  color: $color-text-primary;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  .mobile-menu-toggle.active & {
    transform: rotate(45deg);
  }

  .icon-grid {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    .mobile-menu-toggle.active & {
      opacity: 0;
      transform: scale(0.5);
    }

    circle {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      .mobile-menu-toggle:hover & {
        r: 2;
      }
    }
  }

  .icon-line {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    stroke-linecap: round;

    &.line-h {
      .mobile-menu-toggle.active & {
        transform: rotate(90deg);
        transform-origin: center;
      }
    }

    &.line-v {
      .mobile-menu-toggle.active & {
        opacity: 0;
        transform: scaleY(0);
      }
    }
  }
}

.mobile-menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9998;
}

.mobile-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: min(85vw, 400px);
  height: 100vh;
  background: linear-gradient(165deg, #0f0f0f 0%, #050505 100%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  opacity: 0.5;
}

.panel-diagonal {
  position: absolute;
  top: 0;
  right: 0;
  width: 200%;
  height: 300px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, transparent 60%);
  transform: skewY(-12deg);
  transform-origin: top right;
  pointer-events: none;
}

.panel-close {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg) scale(1.1);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }
}

.close-line {
  position: absolute;
  width: 18px;
  height: 2px;
  background: $color-text-primary;
  border-radius: 2px;

  &:first-child {
    transform: rotate(45deg);
  }

  &:last-child {
    transform: rotate(-45deg);
  }
}

.panel-header {
  padding: $spacing-2xl $spacing-lg $spacing-lg;
  position: relative;
  z-index: 2;
}

.header-code {
  font-family: $font-family-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: $color-text-muted;
  margin-bottom: $spacing-sm;
}

.header-accent {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, $color-text-primary 0%, transparent 100%);
}

.panel-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: $spacing-md;
  padding: 0 $spacing-lg;
  position: relative;
  z-index: 2;
}

.nav-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg 0;
  text-decoration: none;
  color: $color-text-secondary;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -$spacing-lg;
    top: 0;
    width: 3px;
    height: 100%;
    background: $color-text-primary;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover {
    color: $color-text-primary;
    padding-left: $spacing-md;

    &::before {
      transform: scaleY(1);
    }

    .item-num {
      color: $color-text-primary;
      transform: translateX(4px);
    }

    .item-label {
      letter-spacing: 0.15em;
    }

    .item-bar {
      transform: scaleX(1);
    }
  }

  &.router-link-active {
    color: $color-text-primary;

    &::before {
      transform: scaleY(1);
    }

    .item-num {
      color: $color-text-primary;
    }

    .item-bar {
      transform: scaleX(0.5);
      opacity: 0.5;
    }
  }
}

.item-num {
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-text-muted;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.item-label {
  font-size: $font-size-xl;
  font-weight: 600;
  letter-spacing: 0.1em;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.item-bar {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-footer {
  padding: $spacing-lg;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.footer-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  margin-bottom: $spacing-md;
}

.footer-label {
  font-family: $font-family-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: $color-text-muted;
  line-height: 1.6;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

.panel-slide-enter-to,
.panel-slide-leave-from {
  transform: translateX(0);

}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: $color-text-primary;
  }

  @include respond-to(md) {
    display: none;
  }

  @include respond-to(lg) {
    display: flex;
  }
}
</style>
