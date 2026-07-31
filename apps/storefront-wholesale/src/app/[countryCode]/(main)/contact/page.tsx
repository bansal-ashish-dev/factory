import { Metadata } from "next"
import { Heading, Text, Button } from "@medusajs/ui"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Building2,
  MessageSquare,
} from "lucide-react"

// Enable static generation for better performance
export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Contact Us | Thread Buy - B2B Fashion Marketplace",
  description:
    "Contact Thread Buy for B2B fashion marketplace support. Get help with wholesale orders, vendor partnerships, and business inquiries. Call +91 9782077711 or email info@threadbuy.com",
}

export default function ContactPage() {
  return (
    <div className="content-container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heading level="h1" className="text-4xl font-bold mb-4">
            Contact Thread Buy
          </Heading>
          <Text className="text-xl text-ui-fg-subtle max-w-2xl mx-auto">
            Connect with India's leading B2B fashion marketplace. Get support
            for wholesale orders, vendor partnerships, and business growth.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <Heading level="h2" className="text-2xl font-semibold mb-6">
                Get in Touch
              </Heading>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium">Email</Text>
                    <Text className="text-ui-fg-subtle">
                      info@threadbuy.com
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium">Phone</Text>
                    <Text className="text-ui-fg-subtle">+91 9782077711</Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium">Headquarters</Text>
                    <Text className="text-ui-fg-subtle">
                      Rajasthan, India
                      <br />
                      Serving Pan-India
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium">Business Type</Text>
                    <Text className="text-ui-fg-subtle">
                      B2B Fashion Marketplace
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Heading level="h3" className="text-lg font-medium mb-4">
                Business Hours (IST)
              </Heading>
              <div className="space-y-2 text-ui-fg-subtle">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <Heading level="h3" className="text-lg font-medium mb-4">
                Quick Support
              </Heading>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium text-sm">Vendor Support</Text>
                    <Text className="text-xs text-ui-fg-subtle">
                      Join our marketplace
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium text-sm">
                      WhatsApp Business
                    </Text>
                    <Text className="text-xs text-ui-fg-subtle">
                      +91 9782077711
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-ui-fg-muted" />
                  <div>
                    <Text className="font-medium text-sm">Bulk Orders</Text>
                    <Text className="text-xs text-ui-fg-subtle">
                      Minimum order: ₹10,000
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-ui-bg-subtle p-8 rounded-lg">
            <Heading level="h3" className="text-xl font-semibold mb-6">
              Send us a Message
            </Heading>
            <Text className="text-sm text-ui-fg-subtle mb-6">
              Whether you're a retailer, vendor, or have general inquiries,
              we're here to help grow your business.
            </Text>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Inquiry Type
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select inquiry type</option>
                  <option value="vendor-partnership">Vendor Partnership</option>
                  <option value="bulk-order">Bulk Order Inquiry</option>
                  <option value="account-support">Account Support</option>
                  <option value="payment-issue">Payment Issue</option>
                  <option value="shipping-delivery">Shipping & Delivery</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-ui-bg-subtle rounded-lg">
            <Building2 className="w-8 h-8 text-ui-fg-interactive mx-auto mb-4" />
            <Heading level="h3" className="text-lg font-semibold mb-2">
              Become a Vendor
            </Heading>
            <Text className="text-sm text-ui-fg-subtle mb-4">
              Join India's fastest-growing B2B fashion marketplace and reach
              thousands of retailers.
            </Text>
            <a
              href="https://vendor.threadbuy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-ui-bg-interactive text-ui-fg-on-inverted px-4 py-2 rounded-md text-sm font-medium hover:bg-ui-bg-interactive-hover transition-colors"
            >
              Join Now
            </a>
          </div>

          <div className="text-center p-6 bg-ui-bg-subtle rounded-lg">
            <Users className="w-8 h-8 text-ui-fg-interactive mx-auto mb-4" />
            <Heading level="h3" className="text-lg font-semibold mb-2">
              Bulk Orders
            </Heading>
            <Text className="text-sm text-ui-fg-subtle mb-4">
              Get wholesale prices on orders above ₹10,000. Perfect for
              retailers and resellers.
            </Text>
            <a
              href="/store"
              className="inline-block bg-ui-bg-interactive text-ui-fg-on-inverted px-4 py-2 rounded-md text-sm font-medium hover:bg-ui-bg-interactive-hover transition-colors"
            >
              Browse Products
            </a>
          </div>

          <div className="text-center p-6 bg-ui-bg-subtle rounded-lg">
            <MessageSquare className="w-8 h-8 text-ui-fg-interactive mx-auto mb-4" />
            <Heading level="h3" className="text-lg font-semibold mb-2">
              WhatsApp Support
            </Heading>
            <Text className="text-sm text-ui-fg-subtle mb-4">
              Get instant support via WhatsApp Business. Quick responses for
              urgent inquiries.
            </Text>
            <a
              href="https://wa.me/919782077711"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Heading
            level="h2"
            className="text-2xl font-semibold text-center mb-8"
          >
            Frequently Asked Questions
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Heading level="h3" className="text-lg font-medium mb-2">
                  What is the minimum order value?
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Our minimum order value is ₹10,000 for wholesale pricing.
                  Smaller orders are available at retail prices.
                </Text>
              </div>
              <div>
                <Heading level="h3" className="text-lg font-medium mb-2">
                  How do I become a vendor?
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Visit our vendor portal at vendor.threadbuy.com to register
                  and start selling your products to retailers across India.
                </Text>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Heading level="h3" className="text-lg font-medium mb-2">
                  What are your shipping options?
                </Heading>
                <Text className="text-ui-fg-subtle">
                  We offer pan-India shipping with multiple delivery options
                  including express delivery for urgent orders.
                </Text>
              </div>
              <div>
                <Heading level="h3" className="text-lg font-medium mb-2">
                  Do you offer payment terms?
                </Heading>
                <Text className="text-ui-fg-subtle">
                  Yes, we offer flexible payment terms for verified business
                  accounts including credit terms and EMI options.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
