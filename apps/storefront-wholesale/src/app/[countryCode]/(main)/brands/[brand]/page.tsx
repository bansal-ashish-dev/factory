import { getBrandByHandle, getBrandProducts } from "@lib/data/brands"
import { getRegion } from "@lib/data/regions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import BrandDetailTemplate from "@modules/brands/templates/brand-detail"

type Props = {
  params: Promise<{ brand: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
  }>
}

// Enable on-demand static generation - pages will be built when first requested
// and then cached for subsequent requests using the force-cache strategy in data fetching
export const dynamicParams = true

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const brand = await getBrandByHandle(params.brand)

    if (!brand) {
      return {
        title: "Brand not found",
        description: "The brand you are looking for does not exist.",
      }
    }

    return {
      title: `${brand.name} - ThreadBuy`,
      description: brand.description || `Shop products from ${brand.name}`,
    }
  } catch (error) {
    console.error("Error generating brand metadata:", error)
    return {}
  }
}

export default async function BrandPage(props: Props) {
  try {
    const params = await props.params
    const searchParams = await props.searchParams
    const { page } = searchParams

    const pageNumber = page ? parseInt(page) : 1
    const region = await getRegion(params.countryCode)

    if (!region) {
      notFound()
    }

    const brand = await getBrandByHandle(params.brand)

    if (!brand) {
      notFound()
    }

    return (
      <BrandDetailTemplate brand={brand} page={pageNumber} region={region} />
    )
  } catch (error) {
    console.error("Error loading brand page:", error)
    notFound()
  }
}
