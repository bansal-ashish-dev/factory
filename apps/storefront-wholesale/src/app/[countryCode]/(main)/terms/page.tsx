import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"

// Enable static generation for better performance
export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Terms & Conditions | Thread Buy",
  description:
    "Terms and conditions for using Thread Buy's B2B marketplace platform.",
}

export default function TermsPage() {
  return (
    <div className="content-container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Heading level="h1" className="text-4xl font-bold mb-4">
            Terms & Conditions
          </Heading>
          <Text className="text-ui-fg-subtle">
            Last updated: September 2025
          </Text>
        </div>

        <div className="space-y-8 text-ui-fg-subtle leading-relaxed">
          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              1. Acceptance of Terms
            </Heading>
            <Text>
              By accessing and using Thread Buy's platform, you accept and agree
              to be bound by these Terms and Conditions. If you do not agree to
              these terms, please do not use our service.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              2. Description of Service
            </Heading>
            <Text>
              Thread Buy provides a B2B marketplace platform that connects
              manufacturers with retailers and wholesalers. Our service
              facilitates business-to-business transactions and communications
              but does not directly participate in the actual transactions
              between users.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              3. User Accounts
            </Heading>
            <Text className="mb-4">To use our platform, you must:</Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Be at least 18 years old or the age of majority in your
                jurisdiction
              </li>
              <li>Have the authority to enter into binding agreements</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              4. User Conduct
            </Heading>
            <Text className="mb-4">You agree not to:</Text>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for any unlawful purpose</li>
              <li>Impersonate another person or entity</li>
              <li>Upload or transmit harmful or malicious content</li>
              <li>Interfere with the platform's operation or security</li>
              <li>Violate any intellectual property rights</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              5. Transactions
            </Heading>
            <Text>
              All transactions are between buyers and sellers directly. Thread
              Buy acts as a facilitator and is not responsible for the quality,
              safety, legality, or availability of products, or the ability of
              sellers to sell or buyers to buy.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              6. Payment and Fees
            </Heading>
            <Text>
              Thread Buy may charge fees for certain services. All fees are
              non-refundable unless otherwise stated. Payment terms will be
              clearly communicated before any charges are incurred.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              7. Intellectual Property
            </Heading>
            <Text>
              The Thread Buy platform and its content are protected by
              intellectual property laws. You may not copy, modify, distribute,
              or create derivative works without our express permission.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              8. Privacy
            </Heading>
            <Text>
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your information.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              9. Disclaimer of Warranties
            </Heading>
            <Text>
              The platform is provided "as is" without warranties of any kind.
              We disclaim all warranties, express or implied, including but not
              limited to merchantability, fitness for a particular purpose, and
              non-infringement.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              10. Limitation of Liability
            </Heading>
            <Text>
              Thread Buy shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the
              platform, even if we have been advised of the possibility of such
              damages.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              11. Termination
            </Heading>
            <Text>
              We may terminate or suspend your account at any time for
              violations of these terms. You may also terminate your account at
              any time by contacting us.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              12. Governing Law
            </Heading>
            <Text>
              These terms are governed by the laws of [Your Jurisdiction]. Any
              disputes will be resolved in the courts of [Your Jurisdiction].
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              13. Changes to Terms
            </Heading>
            <Text>
              We reserve the right to modify these terms at any time. Changes
              will be effective upon posting. Your continued use of the platform
              constitutes acceptance of the modified terms.
            </Text>
          </section>

          <section>
            <Heading
              level="h2"
              className="text-2xl font-semibold mb-4 text-ui-fg-base"
            >
              14. Contact Information
            </Heading>
            <Text>
              If you have questions about these terms, please contact us at{" "}
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
