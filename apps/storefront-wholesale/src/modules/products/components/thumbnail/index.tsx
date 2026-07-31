import { Container, clx } from "@medusajs/ui"
import ProductPlaceholder from "components/product-placeholder"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
  priority?: boolean
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
  priority = false,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-11/14": isFeatured,
          "aspect-9/16": !isFeatured && size !== "square",
          "aspect-square": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder
        image={initialImage}
        size={size}
        priority={priority}
      />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  priority = false,
}: Pick<ThumbnailProps, "size" | "priority"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center group-hover:scale-110 transition-transform duration-300 ease-in-out"
      draggable={false}
      fill
      quality={95} // Same quality as main/modal images
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      sizes="800px" // Same size as main/modal images (reuses transformation)
      style={{ objectFit: "cover" }}
    />
  ) : (
    <div className="w-full h-full absolute inset-0 group-hover:scale-110 transition-transform duration-300 ease-in-out">
      <ProductPlaceholder
        size={size === "small" ? "medium" : "large"}
        className="w-full h-full"
      />
    </div>
  )
}

export default Thumbnail
