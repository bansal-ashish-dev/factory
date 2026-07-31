"use client"

interface YouTubeVideoProps {
  videoId: string
  title?: string
  className?: string
}

export const YouTubeVideo = ({
  videoId,
  title,
  className,
}: YouTubeVideoProps) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`

  return (
    <div className={`relative aspect-video w-full ${className || ""}`}>
      <iframe
        src={embedUrl}
        title={title || "Product Video"}
        className="h-full w-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
