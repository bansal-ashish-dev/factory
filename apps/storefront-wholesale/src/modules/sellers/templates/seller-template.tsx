import { Badge, Heading, Text, Container } from "@medusajs/ui"
import { Building2, MapPin, Store, Phone, Mail } from "lucide-react"
import { StoreSeller } from "@lib/data/sellers"
import { HttpTypes } from "@medusajs/types"
import SellerLogo from "../../../components/seller-logo-display"
import SellerProductsPaginated from "./seller-products-paginated"

type SellerTemplateProps = {
  seller: StoreSeller
  page: number
  region: HttpTypes.StoreRegion
  countryCode: string
}

const SellerTemplate = ({
  seller,
  page,
  region,
  countryCode,
}: SellerTemplateProps) => {
  return (
    <div className="bg-neutral-100">
      <div className="flex flex-col py-6 content-container gap-4">
        {/* Breadcrumb could go here */}

        <div className="flex flex-col small:flex-row small:items-start gap-3">
          {/* Sidebar */}
          <div className="flex flex-col divide-neutral-200 small:w-1/5 w-full gap-3">
            <Container className="flex flex-col p-6 w-full">
              {/* Seller Info */}
              <div className="flex flex-col items-center text-center mb-6">
                <SellerLogo
                  src={seller.photo}
                  alt={seller.name}
                  size="large"
                  variant="rounded"
                  className="mb-4"
                />

                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    size="small"
                    className={`${
                      seller.store_status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {seller.store_status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <Heading level="h1" className="text-xl font-bold mb-2">
                  {seller.name}
                </Heading>

                <Badge size="small" className="bg-blue-100 text-blue-800 mb-3">
                  <Building2 className="w-3 h-3 mr-1" />
                  {seller.type === "manufacturer" ? "Manufacturer" : "Reseller"}
                </Badge>

                {seller.description && (
                  <Text className="text-ui-fg-subtle text-sm leading-relaxed">
                    {seller.description}
                  </Text>
                )}
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4 space-y-3">
                {seller.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-ui-fg-muted" />
                    <Text className="text-xs text-ui-fg-subtle break-all">
                      {seller.email}
                    </Text>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-ui-fg-muted" />
                    <Text className="text-xs text-ui-fg-subtle">
                      {seller.phone}
                    </Text>
                  </div>
                )}
                {(seller.city || seller.address_line) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-ui-fg-muted" />
                    <Text className="text-xs text-ui-fg-subtle">
                      {[seller.address_line, seller.city]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  </div>
                )}
              </div>
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

              <SellerProductsPaginated
                sellerId={seller.id}
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

export default SellerTemplate
