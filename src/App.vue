<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import TheHeader from '@/components/common/TheHeader.vue'
import TheFooter from '@/components/common/TheFooter.vue'

useKeyboardShortcuts()

let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0

const handleMouseMove = (e: MouseEvent) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 100
  targetY = (e.clientY / window.innerHeight - 0.5) * 100
}

const animateBackground = () => {
  mouseX += (targetX - mouseX) * 0.05
  mouseY += (targetY - mouseY) * 0.05
  
  const app = document.getElementById('app')
  if (app) {
    app.style.setProperty('--mouse-x', `${mouseX}px`)
    app.style.setProperty('--mouse-y', `${mouseY}px`)
  }
  
  requestAnimationFrame(animateBackground)
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('mousemove', handleMouseMove)
  animateBackground()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div id="app">
    <TheHeader />
    <main>
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  width: 100%;
}
</style>
