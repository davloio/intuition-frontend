<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAnimations } from '@/composables/useAnimations'

const props = defineProps<{
  words: string[]
  interval?: number
}>()

const currentWord = ref(props.words[0])
const wordElement = ref<HTMLElement | null>(null)
const { rotateText } = useAnimations()
let timeline: gsap.core.Timeline | null = null

onMounted(() => {
  if (wordElement.value && props.words.length > 1) {
    timeline = rotateText(wordElement.value, props.words, props.interval || 2000)
  }
})

onUnmounted(() => {
  if (timeline) {
    timeline.kill()
  }
})
</script>

<template>
  <span ref="wordElement" class="animated-text">{{ currentWord }}</span>
</template>

<style lang="scss" scoped>
.animated-text {
  display: inline-block;
  @include gradient-text;
  font-weight: 700;
}
</style>
