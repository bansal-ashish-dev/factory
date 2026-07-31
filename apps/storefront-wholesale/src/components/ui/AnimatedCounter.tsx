"use client"

import { useRef, useEffect } from "react"

type AnimatedCounterProps = {
  from: number
  to: number
  duration?: number
}

const AnimatedCounter = ({
  from,
  to,
  duration = 6000,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial value
    element.textContent = String(from)

    // Create intersection observer to trigger animation when element comes into view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If reduced motion is enabled in system's preferences
            if (window.matchMedia("(prefers-reduced-motion)").matches) {
              element.textContent = String(to)
              return
            }

            // Animate counter
            const startTime = Date.now()
            const animationFrame = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)

              // Easing function (easeOut)
              const easedProgress = 1 - Math.pow(1 - progress, 3)

              const currentValue = from + (to - from) * easedProgress
              element.textContent = Number(
                currentValue.toFixed(0)
              ).toLocaleString()

              if (progress < 1) {
                requestAnimationFrame(animationFrame)
              }
            }

            requestAnimationFrame(animationFrame)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px" }
    )

    observerRef.current.observe(element)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [from, to, duration])

  return <span ref={ref} />
}

export default AnimatedCounter
