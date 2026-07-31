"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

// Custom hook to check authentication status
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const currentCustomer = await retrieveCustomer()
        
        if (currentCustomer) {
          setIsAuthenticated(true)
          setCustomer(currentCustomer)
        } else {
          setIsAuthenticated(false)
          setCustomer(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
        setCustomer(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return {
    isAuthenticated,
    customer,
    isLoading,
  }
}
