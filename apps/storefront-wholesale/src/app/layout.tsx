import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { satoshi, integralCF } from "styles/fonts"
import FloatingWhatsAppButton from "../components/floating-whatsapp-button"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${satoshi.variable} ${integralCF.variable}`}>
        <main className="relative">{props.children}</main>
        <FloatingWhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
