import { listBrands } from "@lib/data/brands"
import BrandsMenu from "./brands-menu"

export async function BrandsMenuWrapper() {
  const brands = await listBrands({ limit: 50 }).catch(() => [])

  return <BrandsMenu brands={brands} />
}

export default BrandsMenuWrapper
