import { getSellerByHandle, getSellerProducts } from "@lib/data/sellers"
import { listRegions } from "@lib/data/regions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import SellerTemplate from "@modules/sellers/templates/seller-template"

// Enable on-demand static generation - pages will be built when first requested
// and then cached for subsequent requests using the force-cache strategy in data fetching
export const dynamicParams = true

type Props = {
  params: Promise<{ seller: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const seller = await getSellerByHandle(params.seller).catch(() => null)

  if (!seller) {
    return {
      title: "Seller not found",
      description: "The seller you are looking for does not exist.",
    }
  }

  return {
    title: `${seller.company_name || seller.name} - Seller Profile`,
    description:
      seller.description ||
      `Shop products from ${seller.company_name || seller.name}`,
  }
}

export default async function SellerPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { page } = searchParams

  const pageNumber = page ? parseInt(page) : 1

  const seller = await getSellerByHandle(params.seller).catch(() => null)

  if (!seller) {
    notFound()
  }

  // Get regions first to get the proper region object
  const regions = await listRegions().catch(() => [])
  const region = regions.find((r) =>
    r.countries?.some((c) => c.iso_2 === params.countryCode)
  )

  if (!region) {
    notFound()
  }

  return (
    <SellerTemplate
      seller={seller}
      page={pageNumber}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
