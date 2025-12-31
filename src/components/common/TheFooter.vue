<script setup lang="ts">
import { useFooterAnimations } from '@/composables/useFooterAnimations'

const currentYear = new Date().getFullYear()
const { footerRef, backgroundRef, blobsRef } = useFooterAnimations()
</script>

<template>
  <footer ref="footerRef" class="footer">
    <div class="container">
      <div ref="backgroundRef" class="footer-box">
        <div class="gradient-layer"></div>
        <div ref="blobsRef" class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>

        <div class="footer-content">
      <div class="footer-hero">
        <h2 class="footer-title">
          <span class="line">INTUITION</span>
          <span class="line">EXPLORER</span>
        </h2>
        <p class="footer-tagline">Next generation blockchain explorer</p>
      </div>

      <div class="footer-columns">
        <div class="footer-column">
          <div class="section-code">NAV</div>
          <h3 class="column-title">Explorer</h3>
          <nav class="nav-group">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
            <RouterLink to="/blocks" class="nav-link">Blocks</RouterLink>
            <RouterLink to="/transactions" class="nav-link">Transactions</RouterLink>
            <RouterLink to="/addresses" class="nav-link">Addresses</RouterLink>
          </nav>
        </div>

        <div class="footer-column">
          <div class="section-code">EXT</div>
          <h3 class="column-title">Resources</h3>
          <nav class="nav-group">
            <a href="https://intuition.systems" target="_blank" rel="noopener noreferrer" class="nav-link">
              Intuition Systems
            </a>
            <a href="https://docs.intuition.systems" target="_blank" rel="noopener noreferrer" class="nav-link">
              Documentation
            </a>
            <a href="https://github.com/davloio" target="_blank" rel="noopener noreferrer" class="nav-link">
              GitHub
            </a>
          </nav>
        </div>

        <div class="footer-column">
          <div class="section-code">INF</div>
          <h3 class="column-title">About</h3>
          <p class="info-text">
            Next generation blockchain explorer for Intuition Systems.
            Built with precision and clarity.
          </p>
        </div>

        <div class="footer-column">
          <div class="section-code">CNT</div>
          <h3 class="column-title">Contact</h3>
          <p class="info-text">
            For technical inquiries or explorer-related questions, reach out to our team.
          </p>
          <a href="mailto:explorer@davlo.io" class="contact-email">
            explorer@davlo.io
          </a>
        </div>
      </div>

      <div class="footer-bottom">
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
  position: relative;
  margin-top: auto;
  padding: $spacing-lg 0;
  background: transparent;

  @include respond-to(lg) {
    padding: $spacing-2xl 0;
  }

  .container {
    padding-bottom: clamp(40px, 6vh, 64px);
  }
}

.footer-box {
  position: relative;
  padding: clamp(40px, 6vh, 100px) $spacing-lg $spacing-lg;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 1px 2px rgba(255, 255, 255, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.15),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 1;

  @include respond-to(md) {
    padding: clamp(50px, 8vh, 120px) $spacing-xl $spacing-lg;
  }

  @include respond-to(lg) {
    padding: clamp(60px, 8vh, 120px) $spacing-2xl $spacing-lg;
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

.gradient-layer {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    var(--footer-gradient-1),
    var(--footer-gradient-2),
    var(--footer-gradient-3),
    var(--footer-gradient-4)
  );
  background-size: 400% 400%;
  animation: gradientMorph 20s ease infinite;
  opacity: 0.6;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0;
  filter: blur(80px);
  will-change: transform;
  transform: scale(0.8);

  @include respond-to(lg) {
    width: 700px;
    height: 700px;
    filter: blur(100px);
  }
}

.blob-1 {
  top: -200px;
  right: -200px;
  background: radial-gradient(circle, var(--footer-blob-1), transparent);
  animation: blobMorph1 14s ease-in-out infinite, blobFloat1 10s ease-in-out infinite;
}

.blob-2 {
  bottom: -300px;
  left: -300px;
  background: radial-gradient(circle, var(--footer-blob-2), transparent);
  animation: blobMorph2 16s ease-in-out infinite, blobFloat2 12s ease-in-out infinite;
}

.blob-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, var(--footer-blob-3), transparent);
  animation: blobMorph3 18s ease-in-out infinite, blobFloat3 14s ease-in-out infinite;
}

.footer-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.footer-hero {
  text-align: center;
  margin-bottom: clamp(48px, 8vh, 160px);
  perspective: 1000px;
}

.footer-title {
  font-family: $font-family-primary;
  font-size: clamp(2.5rem, 10vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.9;
  color: $color-text-primary;
  margin: 0;
  transform-style: preserve-3d;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3),
               0 0 60px rgba(255, 255, 255, 0.2);

  .line {
    display: block;
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }
}

.footer-tagline {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: $color-text-secondary;
  margin: $spacing-md 0 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.footer-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 5vh, 80px);

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(40px, 6vh, 80px) clamp(32px, 4vw, 64px);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(48px, 6vh, 80px);
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 32px);
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, opacity;
}

.section-code {
  font-family: $font-family-mono;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $color-text-secondary;
  opacity: 0.3;
  text-transform: uppercase;
}

.column-title {
  font-family: $font-family-primary;
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: 600;
  color: $color-text-primary;
  margin: 0;
  margin-bottom: clamp(12px, 1.5vh, 24px);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-top: auto;
  padding-top: clamp(140px, 20vh, 200px);
  opacity: 0;
  transform: translateY(30px);

  @include respond-to(md) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.5vh, 20px);
}

.nav-link {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 400;
  color: $color-text-secondary;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: fit-content;
  position: relative;

  &:hover {
    color: $color-text-primary;
    transform: translateX(4px);
  }

  &.router-link-active {
    color: $color-text-primary;
    font-weight: 500;
  }
}

.info-text {
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  line-height: 1.6;
  color: $color-text-muted;
  margin: 0;
  margin-bottom: clamp(8px, 1vh, 16px);
}

.contact-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.contact-label {
  font-size: $font-size-xs;
  font-weight: 500;
  color: $color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.contact-email {
  font-family: $font-family-mono;
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: $color-text-primary;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: fit-content;
  position: relative;

  &:hover {
    color: $color-text-primary;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: $color-text-primary;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover::after {
    width: 100%;
  }
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

@media (prefers-reduced-motion: reduce) {
  .footer-box {
    min-height: auto;
  }

  .gradient-layer,
  .blob {
    animation: none !important;
  }
}

[data-theme="light"] {
  .footer-box {
    background: rgba(255, 255, 255, 0.75);
  }
}
</style>
