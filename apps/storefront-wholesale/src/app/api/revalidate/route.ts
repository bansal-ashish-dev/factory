import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string

  if (!tags) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")

  try {
    await Promise.all(
      tagsArray.map(async (tag) => {
        const trimmedTag = tag.trim()

        switch (true) {
          case trimmedTag === "products":
            // Revalidate all product listing pages
            revalidatePath("/[countryCode]/(main)/store", "page")
            revalidatePath("/[countryCode]/(main)/collections/[handle]", "page")
            break

          case trimmedTag.startsWith("product-"):
            // Handle both product-id and product-handle-{handle} tags
            if (trimmedTag.startsWith("product-handle-")) {
              const handle = trimmedTag.replace("product-handle-", "")
              revalidateTag(trimmedTag) // Revalidate handle-specific cached data
              console.log(`Revalidated cache for product handle ${handle}`)
            } else {
              // Regular product-{id} tag
              const productId = trimmedTag.replace("product-", "")
              revalidateTag(trimmedTag) // Revalidate product-specific cached data
              console.log(`Revalidated cache for product ${productId}`)
            }
            // Also revalidate store listing pages
            revalidatePath("/[countryCode]/(main)/store", "page")
            break

          case trimmedTag === "categories":
            revalidatePath(
              "/[countryCode]/(main)/categories/[...category]",
              "page"
            )
            break

          case trimmedTag === "collections":
            revalidatePath("/[countryCode]/(main)/collections", "page")
            revalidatePath("/[countryCode]/(main)/collections/[handle]", "page")
            break

          case trimmedTag === "brands":
            // Revalidate all brand listing pages
            revalidatePath("/[countryCode]/(main)/brands", "page")
            revalidatePath("/[countryCode]/(main)/brands/[brand]", "page")
            // Also revalidate the generic brands tag to clear all cached brand data
            revalidateTag("brands")
            // Revalidate all possible brand-related cache tags
            revalidateTag("brands-default")
            break

          case trimmedTag.startsWith("brand-"):
            // Handle both brand-id and brand-handle-{handle} tags
            if (trimmedTag.startsWith("brand-handle-")) {
              const handle = trimmedTag.replace("brand-handle-", "")
              revalidateTag(trimmedTag) // Revalidate handle-specific cached data
              // Also revalidate the specific brand page
              revalidatePath(`/[countryCode]/(main)/brands/${handle}`, "page")
            } else {
              // Regular brand-{id} tag
              const brandId = trimmedTag.replace("brand-", "")
              revalidateTag(trimmedTag) // Revalidate brand-specific cached data
            }
            // Also revalidate brand listing pages
            revalidatePath("/[countryCode]/(main)/brands", "page")
            break

          default:
            // For any other tags, use revalidateTag
            revalidateTag(trimmedTag)
            break
        }
      })
    )

    return NextResponse.json(
      {
        message: "Cache revalidated successfully",
        tags: tagsArray,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error revalidating cache:", error)
    return NextResponse.json(
      {
        error: "Failed to revalidate cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
