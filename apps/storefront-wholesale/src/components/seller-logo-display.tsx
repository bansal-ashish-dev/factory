"use client"

import Image from 'next/image'
import { Store } from 'lucide-react'
import { clx } from '@medusajs/ui'

interface SellerLogoProps {
  src?: string | null
  alt: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'square' | 'rounded' | 'circle'
  className?: string
  priority?: boolean
}

const sizeConfig = {
  small: {
    container: 'w-12 h-12',
    image: { width: 48, height: 48 },
    icon: 'w-6 h-6'
  },
  medium: {
    container: 'w-16 h-16', 
    image: { width: 64, height: 64 },
    icon: 'w-8 h-8'
  },
  large: {
    container: 'w-20 h-20',
    image: { width: 80, height: 80 },
    icon: 'w-10 h-10'
  }
}

const variantConfig = {
  square: 'rounded-lg',
  rounded: 'rounded-xl', 
  circle: 'rounded-full'
}

export default function SellerLogo({
  src,
  alt,
  size = 'medium',
  variant = 'rounded',
  className = '',
  priority = false
}: SellerLogoProps) {
  const sizeStyles = sizeConfig[size]
  const radiusStyle = variantConfig[variant]

  const isSvg = src?.toLowerCase().endsWith('.svg')

  return (
    <div className={clx(
      'bg-ui-bg-subtle flex items-center justify-center border border-ui-border-base overflow-hidden flex-shrink-0',
      sizeStyles.container,
      radiusStyle,
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={sizeStyles.image.width}
          height={sizeStyles.image.height}
          className={clx(
            'w-full h-full',
            isSvg ? 'object-contain p-2' : 'object-cover'
          )}
          priority={priority}
          onError={(e) => {
            // Hide the image on error and show fallback
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <Store className={clx('text-ui-fg-muted', sizeStyles.icon)} />
      )}
    </div>
  )
}
