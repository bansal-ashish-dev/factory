import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"

// Enable static generation for better performance
export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "About Us | Thread Buy",
  description:
    "Learn more about Thread Buy - your trusted B2B marketplace connecting manufacturers, retailers, and wholesalers.",
}

export default function AboutPage() {
  return (
    <div className="content-container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heading level="h1" className="text-4xl font-bold mb-4">
            About Thread Buy
          </Heading>
          <Text className="text-xl text-ui-fg-subtle">
            Connecting manufacturers with retailers and wholesalers worldwide
          </Text>
        </div>

        <div className="space-y-8">
          <section>
            <Heading level="h2" className="text-2xl font-semibold mb-4">
              Our Mission
            </Heading>
            <Text className="text-ui-fg-subtle leading-relaxed">
              Thread Buy is dedicated to creating a seamless B2B marketplace
              that connects manufacturers directly with retailers and
              wholesalers. We believe in eliminating unnecessary intermediaries
              and creating transparent, efficient trade relationships that
              benefit all parties involved.
            </Text>
          </section>

          <section>
            <Heading level="h2" className="text-2xl font-semibold mb-4">
              What We Do
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-ui-border-base rounded-lg">
                <Heading level="h3" className="text-lg font-medium mb-2">
                  For Manufacturers
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Showcase your products to a global network of verified
                  retailers and wholesalers. Manage your inventory, pricing, and
                  orders all in one place.
                </Text>
              </div>
              <div className="p-6 border border-ui-border-base rounded-lg">
                <Heading level="h3" className="text-lg font-medium mb-2">
                  For Retailers & Wholesalers
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Access a curated selection of quality products directly from
                  manufacturers. Enjoy competitive pricing, reliable supply
                  chains, and personalized service.
                </Text>
              </div>
            </div>
          </section>

          <section>
            <Heading level="h2" className="text-2xl font-semibold mb-4">
              Our Values
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Heading level="h3" className="text-lg font-medium mb-2">
                  Transparency
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Clear pricing, honest communication, and transparent business
                  practices.
                </Text>
              </div>
              <div className="text-center p-4">
                <Heading level="h3" className="text-lg font-medium mb-2">
                  Quality
                </Heading>
                <Text className="text-ui-fg-subtle">
                  We partner only with verified manufacturers who maintain high
                  quality standards.
                </Text>
              </div>
              <div className="text-center p-4">
                <Heading level="h3" className="text-lg font-medium mb-2">
                  Innovation
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Continuously improving our platform to serve our community
                  better.
                </Text>
              </div>
            </div>
          </section>

          <section>
            <Heading level="h2" className="text-2xl font-semibold mb-4">
              Contact Us
            </Heading>
            <Text className="text-ui-fg-subtle">
              Have questions or want to learn more about how Thread Buy can help
              your business? We'd love to hear from you. Reach out to our team
              at{" "}
              <a
                href="mailto:info@threadbuy.com"
                className="text-ui-fg-interactive hover:underline"
              >
                info@threadbuy.com
              </a>
            </Text>
          </section>
        </div>
      </div>
    </div>
  )
}
