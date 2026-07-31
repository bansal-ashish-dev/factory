"use client"

import { clx } from '@medusajs/ui'

interface ProductPlaceholderProps {
  className?: string
  size?: 'small' | 'medium' | 'large' | 'full'
}

export default function ProductPlaceholder({ 
  className = '',
  size = 'full'
}: ProductPlaceholderProps) {
  return (
    <div className={clx(
      'w-full h-full bg-ui-bg-subtle flex items-center justify-center',
      className
    )}>
      <svg 
        viewBox="0 0 120 120" 
        className={clx(
          'text-ui-fg-muted opacity-40',
          {
            'w-12 h-12': size === 'small',
            'w-16 h-16': size === 'medium', 
            'w-20 h-20': size === 'large',
            'w-24 h-24': size === 'full'
          }
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Modern minimalist image icon */}
        <rect 
          x="20" 
          y="25" 
          width="80" 
          height="70" 
          rx="8" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
        />
        <circle 
          cx="40" 
          cy="45" 
          r="8" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
        />
        <path 
          d="M30 75L45 60L60 75L80 55L90 65" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        {/* Optional: Add "No Image" text for larger sizes */}
        {(size === 'large' || size === 'full') && (
          <text 
            x="60" 
            y="110" 
            textAnchor="middle" 
            className="text-xs fill-current"
            fontSize="10"
          >
            No Image
          </text>
        )}
      </svg>
    </div>
  )
}
