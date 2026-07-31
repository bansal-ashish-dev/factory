import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getBrandProducts } from "@lib/data/brands"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

// Enable on-demand static generation - pages will be built when first requested
// and then cached for subsequent requests using the force-cache strategy in data fetching
export const dynamicParams = true

// Enable static generation for better performance
export const revalidate = 3600 // Revalidate every hour

// Optimize for performance
export const dynamic = "force-static"

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, params.countryCode)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Thread Buy`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Thread Buy`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(
    params.handle,
    params.countryCode
  )

  if (!pricedProduct) {
    notFound()
  }

  // Fetch brand products if the product has a brand
  let brandProducts = undefined
  const brand = (pricedProduct as any).brand
  if (brand?.handle) {
    try {
      const brandProductsData = await getBrandProducts(brand.handle, {
        limit: 10,
      })
      brandProducts = brandProductsData.products
    } catch (error) {
      console.error("Error fetching brand products:", error)
    }
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      brandProducts={brandProducts}
    />
  )
}
