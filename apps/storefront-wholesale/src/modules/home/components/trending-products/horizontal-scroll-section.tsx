"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

interface HorizontalScrollSectionProps {
  title: string
  subtitle: string
  children: React.ReactNode
  scrollId: string
}

export const HorizontalScrollSection: React.FC<
  HorizontalScrollSectionProps
> = ({ title, subtitle, children, scrollId }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 text-center px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl lg:txt-xlarge font-bold text-ui-fg-base mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base lg:txt-medium text-ui-fg-subtle">
          {subtitle}
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group">
        {/* Scroll Buttons - Hidden on mobile, visible on larger screens */}
        <button
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full w-10 h-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full w-10 h-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth px-4 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
