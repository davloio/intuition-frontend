<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const transitioning = ref(false)

router.beforeEach((to, from, next) => {
  transitioning.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    transitioning.value = false
  }, 300)
})
</script>

<template>
  <Transition
    name="page"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>

<script lang="ts">
export default {
  methods: {
    onEnter(el: HTMLElement, done: () => void) {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: done
      })
    },
    onLeave(el: HTMLElement, done: () => void) {
      gsap.to(el, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: done
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
