"use client"

import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useCallback, useMemo } from "react"

export function ProductPagination({
  currentPage,
  totalCount,
  limit,
  "data-testid": dataTestid,
}: {
  currentPage: number
  totalCount: number
  limit: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / limit)
  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalCount)

  // Memoized function to handle page changes
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return
      const params = new URLSearchParams(searchParams)
      params.set("page", newPage.toString())
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams, totalPages]
  )

  // Generate page numbers to display
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  // Memoized page numbers
  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers])

  // Don't render if there's only one page or no products
  if (totalPages <= 1 || totalCount === 0) {
    return null
  }

  // Render page button
  const renderPageButton = (
    page: number | string,
    isActive = false,
    index: number
  ) => {
    if (page === "...") {
      return (
        <span key={`ellipsis-${index}`} className="px-3 py-2 text-ui-fg-muted">
          ...
        </span>
      )
    }

    const pageNum = page as number
    return (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={clx(
          "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 min-w-[40px]",
          {
            "bg-ui-bg-interactive text-ui-fg-on-color": isActive,
            "bg-ui-bg-subtle text-ui-fg-subtle hover:bg-ui-bg-base hover:text-ui-fg-base border border-ui-border-base":
              !isActive,
          }
        )}
      >
        {pageNum}
      </button>
    )
  }

  // Render navigation button
  const renderNavButton = (
    targetPage: number,
    icon: React.ReactNode,
    disabled: boolean,
    label: string
  ) => (
    <button
      onClick={() => !disabled && handlePageChange(targetPage)}
      disabled={disabled}
      className={clx(
        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 border",
        {
          "bg-ui-bg-disabled text-ui-fg-disabled cursor-not-allowed border-ui-border-disabled":
            disabled,
          "bg-ui-bg-subtle text-ui-fg-subtle hover:bg-ui-bg-base hover:text-ui-fg-base border-ui-border-base":
            !disabled,
        }
      )}
      title={label}
    >
      {icon}
      <span className="hidden small:inline">{label}</span>
    </button>
  )

  return (
    <div className="flex flex-col items-center w-full mt-8 small:mt-12 gap-4">
      {/* Results info */}
      <div className="text-center">
        <p className="text-sm text-ui-fg-muted">
          Showing{" "}
          <span className="font-medium text-ui-fg-base">{startItem}</span> to{" "}
          <span className="font-medium text-ui-fg-base">{endItem}</span> of{" "}
          <span className="font-medium text-ui-fg-base">
            {totalCount.toLocaleString()}
          </span>{" "}
          products
        </p>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1" data-testid={dataTestid}>
        {/* First page button */}
        {renderNavButton(
          1,
          <ChevronsLeft size={16} />,
          currentPage === 1,
          "First"
        )}

        {/* Previous page button */}
        {renderNavButton(
          currentPage - 1,
          <ChevronLeft size={16} />,
          currentPage === 1,
          "Previous"
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((page, index) =>
            renderPageButton(page, page === currentPage, index)
          )}
        </div>

        {/* Next page button */}
        {renderNavButton(
          currentPage + 1,
          <ChevronRight size={16} />,
          currentPage === totalPages,
          "Next"
        )}

        {/* Last page button */}
        {renderNavButton(
          totalPages,
          <ChevronsRight size={16} />,
          currentPage === totalPages,
          "Last"
        )}
      </div>

      {/* Mobile: Page info */}
      <div className="small:hidden text-center">
        <p className="text-xs text-ui-fg-muted">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  )
}
