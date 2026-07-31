# Storefront Context

## Current Work: Footer Brands Display Issue

### Problem

The footer is not showing all brands due to two limitations:

1. **API Limit**: `listBrands({ limit: 20 })` - only fetching 20 brands from API
2. **Display Limit**: `brands.slice(0, 6)` - only showing first 6 brands in footer

### Solution

- ✅ Increase API limit to fetch more brands (up to 100 as supported by backend)
- ✅ Increase display limit to show more brands in footer (from 6 to 12)
- ✅ Maintain performance with proper caching

### Files Modified

- ✅ `src/modules/layout/templates/footer/index.tsx` - Updated brand fetching limit from 20 to 100 and display limit from 6 to 12

## Previous Work: Server-Side Domain Context with Caching

### Problem

Previous hydration error solution used dynamic imports to disable SSR, which:

- Prevented proper SEO (no server-rendered content)
- Still required client-side API calls on every page load
- No caching benefits for subdomain data

### Solution Implemented

1. **Server-Side Domain Context Fetching**:

   - Created `src/lib/server/domain-context.ts` with server-side fetching logic
   - Uses Next.js `unstable_cache` for cross-request caching (5-minute TTL)
   - React `cache()` for request deduplication within the same request
   - Proper headers forwarding (`x-original-host`, `x-client-host`)

2. **Hybrid Component Architecture**:

   - `SellerLogo.tsx` - Server Component that fetches and renders on server
   - `SellerLogoClient.tsx` - Client Component for dynamic imports when needed
   - `SellerLogoDynamic.tsx` - Dynamic import wrapper (SSR disabled) as fallback

3. **Caching Strategy**:

   - **Request-level caching**: React cache prevents duplicate fetches in same request
   - **Cross-request caching**: Next.js unstable_cache with 5-minute revalidation
   - **Cache tags**: `domain-context-${host}` for targeted invalidation
   - **Revalidation**: Manual cache invalidation function available

4. **Updated Layouts**:
   - All layouts now use server-rendered `SellerLogo` component
   - Subdomain data is fetched and cached server-side
   - No more client-side API calls for initial page loads

### Files Modified

- ✅ `src/lib/server/domain-context.ts` - **NEW** Server-side fetching with caching
- ✅ `src/components/seller-logo.tsx` - Server Component with dynamic client wrapper
- ✅ `src/components/seller-logo-image.tsx` - **NEW** Client component for Image error handling
- ✅ `src/components/seller-logo-client.tsx` - Client fallback component
- ✅ `src/components/seller-logo-dynamic.tsx` - Updated to use client component
- ✅ `src/modules/layout/templates/nav/index.tsx` - Updated to use server component
- ✅ `src/modules/layout/templates/footer/index.tsx` - Updated to use server component
- ✅ `src/app/[countryCode]/(checkout)/layout.tsx` - Updated to use server component

### Additional Fixes

- ✅ **Event Handler Error**: Fixed "Event handlers cannot be passed to Client Component props" by separating server and client components
- ✅ **SSR/Client Architecture**: Server component fetches data, client component handles interactivity
- ✅ **Dynamic Imports**: Used Next.js dynamic imports to prevent SSR issues with client components

### Benefits

- ✅ **Proper SSR**: Seller logos render on server for better SEO
- ✅ **Caching**: Domain context cached for 5 minutes, reducing API calls
- ✅ **Performance**: No client-side blocking for initial renders
- ✅ **Request Deduplication**: Multiple components on same page share cached data
- ✅ **Fallback Support**: Dynamic imports still available when needed

### ✅ Testing Results - All Tests Passed

- [x] **Subdomain logos render server-side correctly**: kasvi.localhost:3000 shows "KASVI by Keshav Kurtis" branding
- [x] **Caching works**: No duplicate API calls, React cache + Next.js unstable_cache functioning
- [x] **SEO improvements**: Seller logos render in server HTML for better search engine visibility
- [x] **Fallback behavior on main domain**: localhost:3000 shows "Thread Buy" branding correctly
- [x] **Header forwarding**: x-original-host and x-client-host headers working properly
- [x] **Multi-page navigation**: Consistent branding across different pages within subdomain
- [x] **Build compilation**: No errors, TypeScript and build process working correctly

### Playwright Test Evidence

**localhost:3000 (Main Domain):**

- Logo: "Thread Buy"
- Shows all brands: KASVI, ICON, FUREE, ODDY, BLACK HAWK
- Standard marketplace layout

**kasvi.localhost:3000 (Subdomain):**

- Logo: "KASVI by Keshav Kurtis" (seller-specific)
- Shows only seller's brand: "Kasvi"
- Consistent branding across navigation, footer, and all pages
- Proper header forwarding: `x-original-host: "kasvi.localhost:3000"`

### Technical Verification

- ✅ **Server-Side Rendering**: Domain context fetched on server, no hydration errors
- ✅ **Caching**: 5-minute TTL with Next.js unstable_cache + React cache deduplication
- ✅ **API Headers**: Proper x-original-host forwarding to backend domain middleware
- ✅ **Image Error Handling**: Client-side onError handlers working correctly
- ✅ **Dynamic Imports**: SSR-safe component loading without build errors

## Product Cache Revalidation Implementation

### Cache Revalidation Strategy

Implemented granular cache revalidation system that invalidates specific product caches when data is updated in the backend:

### 1. **Revalidation API Endpoint**

```typescript
// /src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string

  // Handle multiple cache tags: products, product-{id}, categories, collections
  const tagsArray = tags.split(",")

  await Promise.all(
    tagsArray.map(async (tag) => {
      switch (true) {
        case tag === "products":
          revalidatePath("/[countryCode]/(main)/store", "page")
          break
        case tag.startsWith("product-"):
          const productId = tag.replace("product-", "")
          revalidateTag(tag) // Revalidate product-specific cached data
          revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
          break
        // ... other cases
      }
    })
  )
}
```

### 2. **Product-Specific Cache Tags**

Enhanced product fetching functions to include product-specific cache tags:

```typescript
// /src/lib/data/products.ts
import { getCacheOptions, getProductCacheTag } from "./cookies"

export const getProductById = async (
  productId: string,
  countryCode: string
) => {
  const next = {
    ...(await getCacheOptions("products", [getProductCacheTag(productId)])),
  }

  // Fetch with both general and product-specific cache tags
  return sdk.client.fetch(`/store/products/${productId}`, {
    // ... other options
    next,
    cache: "force-cache",
  })
}
```

### 3. **Cache Options Enhancement**

```typescript
// /src/lib/data/cookies.ts
export const getCacheOptions = async (
  tag: string,
  additionalTags: string[] = []
): Promise<{ tags: string[] } | {}> => {
  const cacheTag = await getCacheTag(tag)
  return { tags: [`${cacheTag}`, ...additionalTags] }
}

export const getProductCacheTag = (productId: string): string => {
  return `product-${productId}`
}
```

### 4. **Backend Integration**

Backend subscribers automatically trigger cache revalidation:

```typescript
// Backend: /src/subscribers/product-cache-revalidation.ts
// Triggers: GET /api/revalidate?tags=product-{id},products
// Result: Only affected product caches are invalidated
```

### Benefits

- **Granular Invalidation**: Only specific products are revalidated, not entire cache
- **Performance**: Unchanged products remain cached for faster loading
- **Automatic**: No manual cache management required
- **Scalable**: Works with any number of products and cache tags

### Cache Tag Structure

- `products`: General product listing cache
- `product-{id}`: Specific product cache by ID
- `categories`: Category listing cache
- `collections`: Collection listing cache

This ensures optimal cache performance with minimal invalidation overhead.
