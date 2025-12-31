import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useFooterAnimations = () => {
  const footerRef = ref<HTMLElement | null>(null)
  const backgroundRef = ref<HTMLElement | null>(null)
  const blobsRef = ref<HTMLElement | null>(null)

  let scrollTriggers: ScrollTrigger[] = []

  const setupParallax = () => {
    if (!footerRef.value || !backgroundRef.value) return

    const backgroundParallax = gsap.to(backgroundRef.value, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        markers: false
      }
    })

    if (backgroundParallax.scrollTrigger) {
      scrollTriggers.push(backgroundParallax.scrollTrigger)
    }

    const blobs = footerRef.value.querySelectorAll('.blob')
    blobs.forEach((blob, index) => {
      const speed = 10 + (index * 5)
      const blobParallax = gsap.to(blob, {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.value!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          markers: false
        }
      })

      if (blobParallax.scrollTrigger) {
        scrollTriggers.push(blobParallax.scrollTrigger)
      }
    })
  }

  const setupEntryReveal = () => {
    if (!footerRef.value || !backgroundRef.value) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 80%',
        once: true,
        markers: false
      }
    })

    const blobs = footerRef.value.querySelectorAll('.blob')
    tl.fromTo(
      blobs,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 0.25,
        duration: 1.2,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
      },
      '-=1'
    )

    const heroTitle = footerRef.value.querySelector('.footer-title')
    if (heroTitle) {
      const lines = heroTitle.querySelectorAll('.line')
      tl.fromTo(
        lines,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        },
        '-=0.8'
      )
    }

    const tagline = footerRef.value.querySelector('.footer-tagline')
    if (tagline) {
      tl.fromTo(
        tagline,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
    }

    const columns = footerRef.value.querySelectorAll('.footer-column')
    tl.fromTo(
      columns,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power2.out'
      },
      '-=0.6'
    )

    const footerBottom = footerRef.value.querySelector('.footer-bottom')
    if (footerBottom) {
      tl.fromTo(
        footerBottom,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
    }

    if (tl.scrollTrigger) {
      scrollTriggers.push(tl.scrollTrigger)
    }
  }

  const cleanup = () => {
    scrollTriggers.forEach(st => st.kill())
    scrollTriggers = []
    ScrollTrigger.getAll().forEach(st => st.kill())
  }

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)

    setTimeout(() => {
      setupParallax()
      setupEntryReveal()
    }, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    footerRef,
    backgroundRef,
    blobsRef
  }
}
