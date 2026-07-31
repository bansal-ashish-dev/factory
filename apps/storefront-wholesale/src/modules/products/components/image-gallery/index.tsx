"use client"

import { ArrowLeftMini, ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, IconButton } from "@medusajs/ui"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSwipe } from "../../../../hooks/use-swipe"
import { YouTubeVideo } from "../youtube-video"

type MediaItem = {
  id: string
  url: string
  type: "image" | "youtube"
  videoId?: string
  metadata?: any
}

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
}

const ImageGallery = ({ product }: ImageGalleryProps) => {
  const thumbnail = product?.thumbnail
  const images = useMemo(() => product?.images || [], [product])

  // Extract YouTube videos from product metadata
  const youtubeVideos = useMemo(() => {
    return (product as any)?.metadata?.youtube_videos || []
  }, [product])

  // Create media items including YouTube video if available
  const mediaItems = useMemo((): MediaItem[] => {
    const items: MediaItem[] = []

    // Add regular images first
    images.forEach((image) => {
      items.push({
        ...image,
        type: "image",
      })
    })

    // Add thumbnail if no images
    if (items.length === 0 && thumbnail) {
      items.push({
        url: thumbnail,
        id: "thumbnail",
        type: "image",
      })
    }

    // Add YouTube videos as last items if available
    youtubeVideos.forEach((video: any, index: number) => {
      items.push({
        id: `youtube-video-${video.videoId}`,
        url:
          video.thumbnailUrl ||
          `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
        type: "youtube",
        videoId: video.videoId,
      })
    })

    return items
  }, [images, thumbnail, youtubeVideos])

  const [selectedImage, setSelectedImage] = useState(
    mediaItems[0] || {
      url: thumbnail,
      id: "thumbnail",
      type: "image",
    }
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  // Swipe handlers for main gallery
  const mainGallerySwipe = useSwipe({
    onSwipeLeft: () => handleArrowClick("right"),
    onSwipeRight: () => handleArrowClick("left"),
    threshold: 50,
  })

  // Swipe handlers for modal
  const modalSwipe = useSwipe({
    onSwipeLeft: () => handleModalArrowClick("right"),
    onSwipeRight: () => handleModalArrowClick("left"),
    threshold: 50,
  })

  const scrollThumbnailIntoView = useCallback((index: number) => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current
      const thumbnail = container.children[index] as HTMLElement
      if (thumbnail) {
        const containerRect = container.getBoundingClientRect()
        const thumbnailRect = thumbnail.getBoundingClientRect()
        const scrollLeft =
          thumbnail.offsetLeft -
          containerRect.width / 2 +
          thumbnailRect.width / 2

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }, [])

  const handleArrowClick = useCallback(
    (direction: "left" | "right") => {
      if (
        mediaItems.length === 0 ||
        (selectedImageIndex === 0 && direction === "left") ||
        (selectedImageIndex === mediaItems.length - 1 && direction === "right")
      ) {
        return
      }

      let newIndex: number
      if (direction === "left") {
        newIndex = selectedImageIndex - 1
      } else {
        newIndex = selectedImageIndex + 1
      }

      setSelectedImageIndex(newIndex)
      setSelectedImage(mediaItems[newIndex])
      scrollThumbnailIntoView(newIndex)
    },
    [mediaItems, selectedImageIndex, scrollThumbnailIntoView]
  )

  const handleImageClick = useCallback(
    (item: any, index: number) => {
      setSelectedImage(item)
      setSelectedImageIndex(index)
      scrollThumbnailIntoView(index)
    },
    [scrollThumbnailIntoView]
  )

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleModalArrowClick = useCallback(
    (direction: "left" | "right") => {
      if (mediaItems.length === 0) return

      if (direction === "left") {
        const newIndex =
          selectedImageIndex === 0
            ? mediaItems.length - 1
            : selectedImageIndex - 1
        setSelectedImageIndex(newIndex)
        setSelectedImage(mediaItems[newIndex])
      } else {
        const newIndex =
          selectedImageIndex === mediaItems.length - 1
            ? 0
            : selectedImageIndex + 1
        setSelectedImageIndex(newIndex)
        setSelectedImage(mediaItems[newIndex])
      }
    },
    [mediaItems, selectedImageIndex]
  )

  // Scroll to selected thumbnail when index changes
  useEffect(() => {
    if (mediaItems.length > 1) {
      scrollThumbnailIntoView(selectedImageIndex)
    }
  }, [selectedImageIndex, scrollThumbnailIntoView, mediaItems.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) {
        return
      }

      if (isModalOpen) {
        if (e.key === "ArrowLeft") {
          handleModalArrowClick("left")
        } else if (e.key === "ArrowRight") {
          handleModalArrowClick("right")
        } else if (e.key === "Escape") {
          closeModal()
        }
      } else {
        if (e.key === "ArrowLeft") {
          handleArrowClick("left")
        } else if (e.key === "ArrowRight") {
          handleArrowClick("right")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleArrowClick, handleModalArrowClick, isModalOpen, closeModal])

  return (
    <>
      {/* Main Gallery */}
      <div className="flex flex-col gap-4 w-full min-h-fit">
        {/* Main Image */}
        <div
          className={clx(
            "relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-sm border border-neutral-100 group transition-all duration-300 hover:shadow-xl",
            selectedImage.type !== "youtube" && "cursor-zoom-in"
          )}
          id={selectedImage.id}
          onClick={(e) => {
            if (selectedImage.type !== "youtube") {
              openModal()
            }
            // For YouTube videos, let the iframe handle the click
          }}
          {...(selectedImage.type !== "youtube" ? mainGallerySwipe : {})}
        >
          {selectedImage.type === "youtube" ? (
            <YouTubeVideo
              videoId={selectedImage.videoId || ""}
              title="Product video"
              className="w-full h-full"
            />
          ) : (
            !!selectedImage.url && (
              <Image
                src={selectedImage.url}
                priority={selectedImageIndex === 0}
                quality={95} // High quality for main product images
                className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
                alt={
                  ((selectedImage as any).metadata?.alt as string) ||
                  `Product image`
                }
                fill
                sizes="800px" // Single size for all main images
                onError={(e) => {
                  console.error("Failed to load image:", selectedImage.url)
                }}
              />
            )
          )}
          {mediaItems.length > 1 && selectedImage.type !== "youtube" && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Left Arrow */}
              <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2">
                <button
                  disabled={selectedImageIndex === 0}
                  className="group/btn relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 shadow-lg hover:bg-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleArrowClick("left")
                  }}
                  aria-label="Previous image"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ArrowLeftMini className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-200" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </div>

              {/* Right Arrow */}
              <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2">
                <button
                  disabled={selectedImageIndex === mediaItems.length - 1}
                  className="group/btn relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 shadow-lg hover:bg-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleArrowClick("right")
                  }}
                  aria-label="Next image"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ArrowRightMini className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-200" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-sm rounded-full backdrop-blur-md border border-white/20 shadow-lg">
            <span className="font-medium">{selectedImageIndex + 1}</span>
            <span className="text-white/70"> / {mediaItems.length}</span>
          </div>
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              <span className="flex items-center gap-1">
                <span>👆</span>
                Swipe to navigate
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {mediaItems.length > 1 && (
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-3 px-2 scroll-smooth snap-x snap-mandatory mt-2 min-h-[88px] sm:min-h-[96px]"
          >
            {mediaItems.map((item, index) => (
              <button
                key={item.id}
                className={clx(
                  "group/thumb relative flex-shrink-0 aspect-square w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 snap-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  index === selectedImageIndex
                    ? "border-blue-500 shadow-xl ring-4 ring-blue-200/50 scale-105 bg-gradient-to-br from-blue-50 to-purple-50"
                    : "border-neutral-200 hover:border-blue-300 hover:shadow-lg hover:ring-2 hover:ring-blue-100/50"
                )}
                onClick={() => handleImageClick(item, index)}
                aria-label={`View ${
                  item.type === "youtube" ? "video" : "image"
                } ${index + 1} of ${mediaItems.length}`}
                aria-pressed={index === selectedImageIndex}
              >
                <Image
                  src={item.url}
                  alt={
                    item.type === "youtube"
                      ? "Video thumbnail"
                      : `Product thumbnail ${index + 1}`
                  }
                  width={80}
                  height={80}
                  quality={95} // Same quality as main/modal (reuses transformation)
                  loading="lazy"
                  className={clx(
                    "object-cover transition-all duration-300 group-hover/thumb:scale-105",
                    index === selectedImageIndex
                      ? "opacity-100 brightness-110"
                      : "opacity-70 hover:opacity-100 hover:brightness-105"
                  )}
                />
                {item.type === "youtube" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-black/30 transition-colors duration-300">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Product image gallery"
        >
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            {...modalSwipe}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="group/close absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/10 flex items-center justify-center"
              aria-label="Close gallery"
            >
              <div className="flex items-center justify-center w-full h-full">
                <XMark className="w-6 h-6 text-white group-hover/close:text-white transition-colors duration-200" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover/close:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={() => handleModalArrowClick("left")}
                  className="group/btn absolute left-6 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ArrowLeftMini className="w-6 h-6 text-white group-hover/btn:text-white transition-colors duration-200" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
                <button
                  onClick={() => handleModalArrowClick("right")}
                  className="group/btn absolute right-6 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                  aria-label="Next image"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ArrowRightMini className="w-6 h-6 text-white group-hover/btn:text-white transition-colors duration-200" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </>
            )}

            {/* Modal Image */}
            <div className="relative w-full h-full">
              {selectedImage.type === "youtube" ? (
                <YouTubeVideo
                  videoId={selectedImage.videoId || ""}
                  title="Product video"
                  className="w-full h-full"
                />
              ) : (
                !!selectedImage.url && (
                  <Image
                    src={selectedImage.url}
                    alt={
                      ((selectedImage as any).metadata?.alt as string) ||
                      `Product image ${selectedImageIndex + 1}`
                    }
                    fill
                    className="object-contain"
                    sizes="800px" // Same size as main image (reuses transformation)
                    quality={95} // Same quality as main image (reuses transformation)
                    style={{ objectFit: "contain" }}
                  />
                )
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/70 text-white text-sm rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              <span className="font-medium">{selectedImageIndex + 1}</span>
              <span className="text-white/70"> of {mediaItems.length}</span>
            </div>

            {/* Swipe Indicator */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/70 text-white text-xs rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                <span className="flex items-center gap-2">
                  <span>👆</span>
                  Swipe to navigate
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
