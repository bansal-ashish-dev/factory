import { listCategoriesWithProductCount } from "@lib/data/categories"
import MegaMenu from "./mega-menu"

export async function MegaMenuWrapper() {
  const categories = await listCategoriesWithProductCount({ limit: 50 }).catch(
    () => []
  )

  return <MegaMenu categories={categories} />
}

export default MegaMenuWrapper
