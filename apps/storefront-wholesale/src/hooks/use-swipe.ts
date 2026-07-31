import { useCallback, useRef, useState } from "react"

type UseSwipeProps = {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export const useSwipe = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 50 
}: UseSwipeProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
