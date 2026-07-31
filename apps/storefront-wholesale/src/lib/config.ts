import Medusa from "@medusajs/js-sdk"
import { getDomainForwardHeaders } from "./domain-headers"

// Defaults to standard port for Medusa server
let NEXT_PUBLIC_MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  NEXT_PUBLIC_MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// Globally normalize headers, ensure publishable key, and inject x-forwarded-host server-side only
const __baseFetch = sdk.client.fetch.bind(sdk.client)
sdk.client.fetch = (async (path: string, init: any = {}) => {
  try {
    const existing = init.headers

    // Normalize headers into a plain object for safe merging
    const merged: Record<string, string> = {}
    if (existing) {
      if (typeof Headers !== "undefined" && existing instanceof Headers) {
        existing.forEach((v, k) => (merged[k.toLowerCase()] = v))
      } else if (Array.isArray(existing)) {
        for (const [k, v] of existing) {
          if (k) merged[String(k).toLowerCase()] = String(v)
        }
      } else if (typeof existing === "object") {
        for (const k of Object.keys(existing)) {
          merged[k.toLowerCase()] = String(existing[k])
        }
      }
    }

    // Ensure publishable key header is present
    const publishable = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (publishable && !merged["x-publishable-api-key"]) {
      merged["x-publishable-api-key"] = publishable
    }

    // Inject forwarded host on both server and client runtime
    const fwd = await getDomainForwardHeaders()
    for (const k of Object.keys(fwd)) {
      const key = k.toLowerCase()
      if (!merged[key]) merged[key] = fwd[k]
    }

    if (Object.keys(merged).length) {
      init.headers = merged
    }

    // Ensure cookies are sent for session-based endpoints (e.g., /store/customers/me)
    if (!init.credentials) {
      init.credentials = "include"
    }
  } catch {
    // best-effort; do not block the request
  }

  return __baseFetch(path, init)
}) as typeof sdk.client.fetch
