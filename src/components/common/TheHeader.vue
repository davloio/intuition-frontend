<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SearchModal from './SearchModal.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { initTheme } = useTheme()
const route = useRoute()

const isBlocksActive = computed(() => {
  return route.path === '/blocks' || route.path.startsWith('/blocks/')
})

const isTransactionsActive = computed(() => {
  return route.path === '/transactions' || route.path.startsWith('/transactions/')
})

const isAddressesActive = computed(() => {
  return route.path === '/addresses' || route.path.startsWith('/addresses/')
})

const isHomeActive = computed(() => {
  return route.path === '/'
})

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
  initTheme()
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
          <RouterLink
            to="/"
            class="logo"
          >
            <svg
              class="logo-icon"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
            </svg>
            <span class="logo-text">
              INTUITION <span class="logo-text-tech">EXPLORER</span>
            </span>
          </RouterLink>

          <nav class="nav desktop-nav">
            <RouterLink
              to="/"
              class="nav-link"
              :class="{ 'router-link-active': isHomeActive }"
              data-text="Home"
            >
              <span class="nav-link-inner border-gradient glass-card">Home</span>
            </RouterLink>
            <RouterLink
              to="/blocks"
              class="nav-link"
              :class="{ 'router-link-active': isBlocksActive }"
              data-text="Blocks"
            >
              <span class="nav-link-inner border-gradient glass-card">Blocks</span>
            </RouterLink>
            <RouterLink
              to="/transactions"
              class="nav-link"
              :class="{ 'router-link-active': isTransactionsActive }"
              data-text="Transactions"
            >
              <span class="nav-link-inner border-gradient glass-card">Transactions</span>
            </RouterLink>
            <RouterLink
              to="/addresses"
              class="nav-link"
              :class="{ 'router-link-active': isAddressesActive }"
              data-text="Addresses"
            >
              <span class="nav-link-inner border-gradient glass-card">Addresses</span>
            </RouterLink>
          </nav>

          <div class="header-actions">
            <button
              class="search-button"
              aria-label="Search"
              @click="openSearchModal"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          class="mobile-menu-toggle"
          aria-label="Toggle menu"
          :class="{ 'active': mobileMenuOpen }"
          @click="toggleMobileMenu"
        >
          <span class="menu-line" />
          <span class="menu-line" />
          <span class="menu-line" />
        </button>
      </div>
    </div>

    <ThemeToggle />
    <SearchModal
      v-if="searchModalOpen"
      @close="closeSearchModal"
    />

    <Teleport to="body">
      <transition name="menu-fade">
        <div
          v-if="mobileMenuOpen"
          class="mobile-menu-backdrop"
          @click="toggleMobileMenu"
        >
          <div
            class="mobile-menu-wrapper"
            @click.stop
          >
            <button
              class="menu-close"
              aria-label="Close menu"
              @click="toggleMobileMenu"
            >
              <span class="close-icon">×</span>
            </button>

            <nav class="menu-nav">
              <RouterLink
                to="/"
                class="menu-item"
                :class="{ 'router-link-active': isHomeActive }"
                @click="toggleMobileMenu"
              >
                <span class="item-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <span class="item-text">Home</span>
              </RouterLink>
              <RouterLink
                to="/blocks"
                class="menu-item"
                :class="{ 'router-link-active': isBlocksActive }"
                @click="toggleMobileMenu"
              >
                <span class="item-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                    />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </span>
                <span class="item-text">Blocks</span>
              </RouterLink>
              <RouterLink
                to="/transactions"
                class="menu-item"
                :class="{ 'router-link-active': isTransactionsActive }"
                @click="toggleMobileMenu"
              >
                <span class="item-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </span>
                <span class="item-text">Transactions</span>
              </RouterLink>
              <RouterLink
                to="/addresses"
                class="menu-item"
                :class="{ 'router-link-active': isAddressesActive }"
                @click="toggleMobileMenu"
              >
                <span class="item-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                    />
                  </svg>
                </span>
                <span class="item-text">Addresses</span>
              </RouterLink>
            </nav>
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
  background: var(--header-bg);
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
      var(--header-border) 0%,
      rgba(128, 128, 128, 0.05) 50%,
      rgba(128, 128, 128, 0.0) 100%
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
}

.logo-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  
  circle {
    transition: stroke 0.3s ease;
  }
  
  [data-theme="dark"] & circle {
    stroke: #ffffff;
  }
  
  [data-theme="light"] & circle {
    stroke: #000000;
  }
  
  .logo:hover & circle {
    [data-theme="dark"] & {
      stroke: #cccccc;
    }
    
    [data-theme="light"] & {
      stroke: #444444;
    }
  }
}

.logo-text {
  font-size: $font-size-base;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: color 0.3s ease;
  
  [data-theme="dark"] & {
    color: #ffffff;
  }
  
  [data-theme="light"] & {
    color: #000000;
  }
  
  .logo:hover & {
    [data-theme="dark"] & {
      color: #cccccc;
    }
    
    [data-theme="light"] & {
      color: #444444;
    }
  }
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
    border: 1px solid transparent;
  }

  &:hover .nav-link-inner {
    color: $color-text-primary;
    opacity: 1;

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.06);
      border-color: rgba(0, 0, 0, 0.1);
    }

    [data-theme="dark"] & {
      background: rgba(0, 0, 0, 0.4);
      border-color: $color-border;
    }
  }

  &.router-link-active .nav-link-inner {
    color: $color-text-primary;
    opacity: 1;

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.06);
      border-color: rgba(0, 0, 0, 0.1);
    }

    [data-theme="dark"] & {
      background: rgba(0, 0, 0, 0.4);
      border-color: $color-border;
    }
  }

  &:active .nav-link-inner {
    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.08);
      border-color: rgba(0, 0, 0, 0.15);
    }

    [data-theme="dark"] & {
      background: rgba(0, 0, 0, 0.5);
      border-color: $color-border-hover;
    }
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &:hover {
    .menu-line {
      &:first-child {
        width: 20px;
      }

      &:last-child {
        width: 20px;
      }
    }
  }

  &.active {
    .menu-line {
      &:first-child {
        transform: translateY(7px) rotate(45deg);
        width: 18px;
      }

      &:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      &:last-child {
        transform: translateY(-7px) rotate(-45deg);
        width: 18px;
      }
    }
  }

  @include respond-to(lg) {
    display: none;
  }
}

.menu-line {
  width: 18px;
  height: 2px;
  background: $color-text-primary;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:first-child,
  &:last-child {
    width: 14px;
  }
}

.mobile-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md;
  z-index: 9999;
}

.mobile-menu-wrapper {
  width: 100%;
  max-width: 340px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  padding: $spacing-xl;

  [data-theme="light"] & {
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.menu-close {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  border-radius: 50%;
  color: $color-text-muted;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    color: $color-text-primary;
  }

  &:active {
    transform: scale(0.9);
  }
}

.close-icon {
  font-size: 20px;
  line-height: 1;
  display: block;
  pointer-events: none;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: $spacing-xs;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  text-decoration: none;
  color: $color-text-secondary;
  font-size: $font-size-base;
  font-weight: 400;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;

  [data-theme="light"] & {
    color: rgba(0, 0, 0, 0.6);
  }

  &:hover {
    color: $color-text-primary;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);

    [data-theme="light"] & {
      color: rgba(0, 0, 0, 0.9);
      background: rgba(0, 0, 0, 0.04);
      border-color: rgba(0, 0, 0, 0.08);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &.router-link-active {
    color: $color-text-primary;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);

    [data-theme="light"] & {
      color: rgba(0, 0, 0, 0.9);
      background: rgba(0, 0, 0, 0.06);
      border-color: rgba(0, 0, 0, 0.1);
    }
  }
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  .menu-item:hover &,
  .menu-item.router-link-active & {
    opacity: 1;
  }

  svg {
    display: block;
  }
}

.item-text {
  flex: 1;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-fade-enter-active .mobile-menu-wrapper {
  animation: menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-fade-leave-active .mobile-menu-wrapper {
  animation: menuSlideOut 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes menuSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes menuSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
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
    color: $color-text-primary;

    [data-theme="light"] & {
      background: rgba(0, 0, 0, 0.06);
    }

    [data-theme="dark"] & {
      background: rgba(0, 0, 0, 0.4);
    }
  }

  @include respond-to(md) {
    display: none;
  }

  @include respond-to(lg) {
    display: flex;
  }
}
</style>
