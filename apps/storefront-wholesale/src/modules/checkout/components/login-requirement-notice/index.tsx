"use client"

import { Alert, Text } from "@medusajs/ui"
import { AlertTriangle, User } from "lucide-react"
import Button from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface LoginRequirementNoticeProps {
  message?: string
  showActionButtons?: boolean
}

const LoginRequirementNotice = ({
  message = "You must create an account or log in to complete your purchase.",
  showActionButtons = true,
}: LoginRequirementNoticeProps) => {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <div className="flex flex-col gap-2">
        <Text className="txt-small font-medium text-red-800">
          Login Required to Place Order
        </Text>
        <Text className="txt-small text-red-700">{message}</Text>
        {showActionButtons && (
          <div className="flex flex-row gap-3 mt-2">
            <LocalizedClientLink href="/account?view=register">
              <Button
                variant="secondary"
                size="small"
                className="h-8 px-4 text-xs"
                data-testid="checkout-register-button"
              >
                <User className="h-3 w-3 mr-1" />
                Create Account
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/account?view=log-in">
              <Button
                variant="primary"
                size="small"
                className="h-8 px-4 text-xs"
                data-testid="checkout-login-button"
              >
                Log In
              </Button>
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </Alert>
  )
}

export default LoginRequirementNotice
