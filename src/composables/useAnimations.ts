import gsap from 'gsap'

export function useAnimations() {
  const fadeIn = (element: HTMLElement | string, options: gsap.TweenVars = {}) => {
    return gsap.from(element, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...options
    })
  }

  const slideIn = (element: HTMLElement | string, options: gsap.TweenVars = {}) => {
    return gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    })
  }

  const staggerIn = (elements: HTMLElement[] | string, options: gsap.TweenVars = {}) => {
    return gsap.from(elements, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.out',
      ...options
    })
  }

  const countUp = (element: HTMLElement, endValue: number, options: gsap.TweenVars = {}) => {
    const obj = { value: 0 }
    return gsap.to(obj, {
      value: endValue,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value).toLocaleString()
      },
      ...options
    })
  }

  const pulseGlow = (element: HTMLElement | string) => {
    return gsap.to(element, {
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)',
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })
  }

  const rotateText = (element: HTMLElement, words: string[], interval: number = 2000) => {
    let currentIndex = 0
    const timeline = gsap.timeline({ repeat: -1 })

    words.forEach((word, index) => {
      timeline
        .to(element, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            element.textContent = words[(currentIndex + 1) % words.length]
            currentIndex = (currentIndex + 1) % words.length
          }
        })
        .to(element, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        .to({}, { duration: interval / 1000 - 1 })
    })

    return timeline
  }

  return {
    fadeIn,
    slideIn,
    staggerIn,
    countUp,
    pulseGlow,
    rotateText
  }
}
