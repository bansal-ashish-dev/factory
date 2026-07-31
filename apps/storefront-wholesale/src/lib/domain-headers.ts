// Returns headers that forward the storefront host to the backend so
// backend domain middleware can resolve the seller context correctly.
// Works in both Server Components (App Router) and Client Components.
// Uses x-original-host since Railway overwrites x-forwarded-host.
export async function getDomainForwardHeaders(): Promise<Record<string, string>> {
  // Server runtime
  if (typeof window === 'undefined') {
    try {
      const nh = await import('next/headers')
      const h = await nh.headers()
      const host = h.get('host') || ''
      if (host) {
        return { 
          'x-original-host': host,
          'x-client-host': host  // Backup header
        }
      }
    } catch {
      // headers() unavailable outside server context
    }
    return {}
  }

  // Client runtime
  try {
    const host = window.location?.hostname || ''
    if (host) {
      return { 
        'x-original-host': host,
        'x-client-host': host  // Backup header
      }
    }
  } catch {
    // ignore
  }
  return {}
}
