import { listBrands } from "@lib/data/brands"
import { getRegion } from "@lib/data/regions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import BrandsTemplate from "@modules/brands/templates"

export const metadata: Metadata = {
  title: "Brands - ThreadBuy",
  description: "Explore all brands available in our marketplace",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    page?: string
    q?: string
  }>
}

export default async function BrandsPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params

  const { page, q } = searchParams || {}

  // Validate and parse page number
  const pageNumber = Math.max(1, parseInt(page || "1"))
  const limit = 24 // Show 24 brands per page for better UX
  const offset = (pageNumber - 1) * limit

  // Get region for localization
  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()
  }

  // Fetch brands with pagination
  const brands = await listBrands({
    limit,
    offset,
    q,
  })

  // Determine if there are more pages by checking if we got a full page
  const hasNextPage = brands.length === limit
  const hasPreviousPage = pageNumber > 1

  return (
    <BrandsTemplate
      brands={brands}
      region={region}
      countryCode={params.countryCode}
      currentPage={pageNumber}
      searchQuery={q}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      limit={limit}
    />
  )
}
