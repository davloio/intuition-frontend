<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button 
    class="theme-toggle" 
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" 
    :class="{ 'is-light': theme === 'light' }"
    @click="toggleTheme"
  >
    <div class="toggle-wrapper">
      <svg
        v-if="theme === 'dark'"
        class="icon icon-moon"
        width="36"
        height="36"
        viewBox="0 0 36 36"
      >
        <defs>
          <radialGradient
            id="moonGlow"
            cx="50%"
            cy="50%"
          >
            <stop
              offset="0%"
              stop-color="currentColor"
              stop-opacity="0.25"
            />
            <stop
              offset="100%"
              stop-color="currentColor"
              stop-opacity="0"
            />
          </radialGradient>
          <mask id="moonMask">
            <rect
              width="36"
              height="36"
              fill="white"
            />
            <circle
              cx="22"
              cy="18"
              r="7"
              fill="black"
            />
          </mask>
        </defs>
        
        <circle
          class="moon-glow"
          cx="18"
          cy="18"
          r="16"
          fill="url(#moonGlow)"
        />
        
        <circle 
          class="moon-crescent" 
          cx="18" 
          cy="18" 
          r="8" 
          fill="currentColor"
          mask="url(#moonMask)"
        />
        
        <circle
          class="star star-1"
          cx="10"
          cy="10"
          r="1"
          fill="currentColor"
        />
        <circle
          class="star star-2"
          cx="28"
          cy="12"
          r="1.2"
          fill="currentColor"
        />
        <circle
          class="star star-3"
          cx="9"
          cy="25"
          r="0.8"
          fill="currentColor"
        />
        <circle
          class="star star-4"
          cx="27"
          cy="26"
          r="1"
          fill="currentColor"
        />
      </svg>

      <svg
        v-else
        class="icon icon-sun"
        width="36"
        height="36"
        viewBox="0 0 36 36"
      >
        <defs>
          <radialGradient
            id="sunGlow"
            cx="50%"
            cy="50%"
          >
            <stop
              offset="0%"
              stop-color="currentColor"
              stop-opacity="0.3"
            />
            <stop
              offset="100%"
              stop-color="currentColor"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>
        
        <circle
          class="sun-glow"
          cx="18"
          cy="18"
          r="16"
          fill="url(#sunGlow)"
        />
        
        <circle
          class="sun-core"
          cx="18"
          cy="18"
          r="5"
          fill="currentColor"
        />

        <line
          class="ray ray-1"
          x1="18"
          y1="7.5"
          x2="18"
          y2="5.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-2"
          x1="25.4"
          y1="10.6"
          x2="26.8"
          y2="9.2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-3"
          x1="28.5"
          y1="18"
          x2="30.5"
          y2="18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-4"
          x1="25.4"
          y1="25.4"
          x2="26.8"
          y2="26.8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-5"
          x1="18"
          y1="28.5"
          x2="18"
          y2="30.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-6"
          x1="10.6"
          y1="25.4"
          x2="9.2"
          y2="26.8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-7"
          x1="7.5"
          y1="18"
          x2="5.5"
          y2="18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          class="ray ray-8"
          x1="10.6"
          y1="10.6"
          x2="9.2"
          y2="9.2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.theme-toggle {
  position: fixed;
  top: $spacing-lg;
  left: $spacing-lg;
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @include respond-to(md) {
    display: flex;
    top: $spacing-xl;
    right: $spacing-xl;
    left: auto;
  }

  &:hover {
    .icon-moon {
      .moon-crescent {
        transform: scale(1.08);
      }

      .moon-glow {
        transform: scale(1.15);
        opacity: 0.8;
      }
    }

    .icon-sun {
      transform: rotate(180deg);

      .sun-core {
        transform: scale(1.15);
      }

      .sun-glow {
        transform: scale(1.2);
        opacity: 0.6;
      }

      .ray {
        transform: scale(1.2);
      }
    }

    .star {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  &:active {
    transform: scale(0.92);
  }
}

.toggle-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
}

.icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  color: #ffffff;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme="light"] & {
    color: #000000;
  }
}

.icon-moon {
  animation: moonFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-sun {
  animation: sunFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.moon-glow {
  transform-origin: center;
  animation: glowPulse 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all 0.3s ease;
}

.moon-crescent {
  transform-origin: center;
  animation: crescentExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition: transform 0.3s ease;
}

.star {
  opacity: 0.6;
  transition: all 0.3s ease;
  transform-origin: center;
}

.star-1 {
  animation: starTwinkle 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

.star-2 {
  animation: starTwinkle 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.star-3 {
  animation: starTwinkle 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.star-4 {
  animation: starTwinkle 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}

.sun-glow {
  transform-origin: center;
  animation: glowExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all 0.3s ease;
}

.sun-core {
  transform-origin: center;
  animation: coreExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition: transform 0.3s ease;
}

.ray {
  transform-origin: center;
  transition: all 0.3s ease;
}

.ray-1 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0s;
}

.ray-2 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
}

.ray-3 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

.ray-4 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

.ray-5 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.ray-6 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s;
}

.ray-7 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.ray-8 {
  animation: rayExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;
}

@keyframes moonFadeIn {
  0% {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes sunFadeIn {
  0% {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes glowPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes crescentExpand {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes starTwinkle {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

@keyframes glowExpand {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes coreExpand {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rayExpand {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
