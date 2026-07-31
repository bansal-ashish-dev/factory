"use client"

import { clx, Container, Text, Alert } from "@medusajs/ui"
import Button from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

const BackgroundImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = "/images/login-banner-bg.png"
    img.onload = () => setImageLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-full transition-opacity duration-300">
      <Image
        src="/images/login-banner-bg.png"
        alt="Login banner background"
        className={clx(
          "absolute inset-0 object-cover object-center w-full h-full transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        layout="fill"
        priority
      />
    </div>
  )
}

const SignInPrompt = () => {
  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <Alert className="border-orange-200 bg-orange-50 border-2">
        <AlertTriangle className="h-4 w-4" />
        <div className="flex flex-col gap-1">
          <Text className="txt-small font-medium text-orange-800">
            Account Required to Complete Purchase
          </Text>
          <Text className="txt-small text-orange-700">
            You need to create an account or log in to place your order and
            track your purchases.
          </Text>
        </div>
      </Alert>

      {/* Enhanced Sign In Banner */}
      <Container className="flex justify-between self-stretch relative w-full h-36 p-0 overflow-hidden border-2 border-orange-300 rounded-lg shadow-xl bg-white z-20 ring-2 ring-orange-200">
        <BackgroundImage />
        <div className="absolute inset-0 z-1 flex justify-between items-center text-center p-6">
          <div className="flex flex-col items-start bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <Text className="small:text-3xl text-xl text-white font-semibold text-left mb-1">
              Create Account or Log In
            </Text>
            <Text className="text-white/90 text-sm text-left">
              Required to complete your purchase
            </Text>
          </div>
          <div className="flex small:flex-row flex-col small:gap-4 gap-2">
            <LocalizedClientLink href="/account?view=register">
              <Button
                variant="secondary"
                className="small:h-11 h-9 small:min-w-40 min-w-28 rounded-full font-medium"
                data-testid="register-button"
              >
                Create Account
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/account?view=log-in">
              <Button
                variant="primary"
                className="small:h-11 h-9 small:min-w-40 min-w-28 rounded-full font-medium"
                data-testid="login-button"
              >
                Log In
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SignInPrompt
