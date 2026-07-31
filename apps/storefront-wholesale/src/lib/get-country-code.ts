// Client-side utility to extract country code from URL
export const getCountryCodeFromUrl = (): string | null => {
  if (typeof window === "undefined") return null
  
  try {
    // Extract country code from URL path
    // Expected format: /us/... or /gb/... etc.
    const pathSegments = window.location.pathname.split("/")
    const countryCode = pathSegments[1]
    
    // Basic validation - country codes are typically 2 letters
    if (countryCode && countryCode.length === 2 && /^[a-zA-Z]{2}$/.test(countryCode)) {
      return countryCode.toLowerCase()
    }
    
    return null
  } catch (error) {
    console.warn("Could not extract country code from URL:", error)
    return null
  }
}
