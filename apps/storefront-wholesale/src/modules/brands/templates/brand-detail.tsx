import { StoreBrand } from "@lib/data/brands"
import { HttpTypes } from "@medusajs/types"
import { Badge, Heading, Text, Container } from "@medusajs/ui"
import { Package } from "lucide-react"
import BrandLogo from "../../../components/brand-logo"
import BrandProductsPaginated from "./brand-products-paginated"

type BrandDetailTemplateProps = {
  brand: StoreBrand
  page: number
  region: HttpTypes.StoreRegion
}

const BrandDetailTemplate = ({
  brand,
  page,
  region,
}: BrandDetailTemplateProps) => {
  return (
    <div className="bg-neutral-100">
      <div className="flex flex-col py-6 content-container gap-4">
        {/* Breadcrumb could go here */}

        <div className="flex flex-col small:flex-row small:items-start gap-3">
          {/* Sidebar */}
          <div className="flex flex-col divide-neutral-200 small:w-1/5 w-full gap-3">
            <Container className="flex flex-col p-6 w-full">
              {/* Brand Info */}
              <div className="flex flex-col items-center text-center mb-6">
                <BrandLogo
                  src={brand.thumbnail}
                  alt={brand.name}
                  size="large"
                  variant="rounded"
                  className="mb-4"
                />

                <Badge size="small" className="bg-blue-100 text-blue-800 mb-2">
                  <Package className="w-3 h-3 mr-1" />
                  Brand
                </Badge>

                <Heading level="h1" className="text-xl font-bold mb-2">
                  {brand.name}
                </Heading>

                {brand.description && (
                  <Text className="text-ui-fg-subtle text-sm leading-relaxed">
                    {brand.description}
                  </Text>
                )}
              </div>

              {/* Stats - Removed product count as it's unreliable with pagination */}
            </Container>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <Container className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Heading level="h2" className="text-lg font-semibold">
                  All Products
                </Heading>
              </div>

              <BrandProductsPaginated
                brandHandle={brand.handle!}
                page={page}
                region={region}
              />
            </Container>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandDetailTemplate
