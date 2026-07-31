import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"

// Enable static generation for better performance
export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Privacy Policy | Thread Buy",
  description:
    "Thread Buy's privacy policy. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="content-container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Heading level="h1" className="text-4xl font-bold mb-4">
            Privacy Policy
          </Heading>
          <Text className="text-ui-fg-subtle">Last updated: December 2024</Text>
        </div>

        <div className="space-y-8 text-ui-fg-subtle leading-relaxed">
          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              1. Information We Collect
            </Heading>
            <Text className="mb-4">
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us for support.
              This may include:
            </Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Company name, GST number, and business address</li>
              <li>Payment information and billing details</li>
              <li>Communication preferences and account settings</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              2. How We Use Your Information
            </Heading>
            <Text className="mb-4">We use the information we collect to:</Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>
                Communicate with you about products, services, and promotional
                offers
              </li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              3. Information Sharing
            </Heading>
            <Text className="mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties, except in the following
              circumstances:
            </Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              4. Data Security
            </Heading>
            <Text>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              5. Cookies and Tracking
            </Heading>
            <Text>
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              6. Your Rights
            </Heading>
            <Text className="mb-4">You have the right to:</Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              7. Children's Privacy
            </Heading>
            <Text>
              Our service is not directed to children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware that we have collected personal information from a
              child under 13, we will take steps to remove such information.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              8. Changes to This Policy
            </Heading>
            <Text>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the "Last updated" date.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              9. Contact Us
            </Heading>
            <Text>
              If you have any questions about this privacy policy, please
              contact us at{" "}
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
