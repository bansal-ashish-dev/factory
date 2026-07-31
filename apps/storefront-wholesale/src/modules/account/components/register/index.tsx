"use client"

import { useActionState, useState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { Label } from "@medusajs/ui"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [customerType, setCustomerType] = useState<"retailer" | "wholesaler">(
    "retailer"
  )

  return (
    <div
      className="max-w-md flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Join Thread Buy</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Create your business account and get access to wholesale prices and
        exclusive B2B features.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        {/* Customer Type Selection */}
        <div className="mb-4">
          <Label className="text-small-semi text-ui-fg-base mb-3 block">
            Business Type <span className="text-rose-500">*</span>
          </Label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="customer_type"
                value="retailer"
                checked={customerType === "retailer"}
                onChange={(e) =>
                  setCustomerType(e.target.value as "retailer" | "wholesaler")
                }
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                required
              />
              <span className="text-small-regular text-ui-fg-base">
                Retailer
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="customer_type"
                value="wholesaler"
                checked={customerType === "wholesaler"}
                onChange={(e) =>
                  setCustomerType(e.target.value as "retailer" | "wholesaler")
                }
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-small-regular text-ui-fg-base">
                Wholesaler
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col w-full gap-y-2">
          {/* Company Information */}
          <Input
            label="Company Name"
            name="company_name"
            required
            autoComplete="organization"
            data-testid="company-name-input"
          />

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="First name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Last name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>

          {/* Contact Information */}
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />

          {/* Business Address */}
          <Input
            label="Business Address (Street, City, State, ZIP)"
            name="address"
            autoComplete="address-line1"
            data-testid="address-input"
          />

          {/* GST Number */}
          <Input
            label="GST Number (Optional)"
            name="gst_number"
            data-testid="gst-number-input"
          />

          {/* Password */}
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating an account, you agree to Thread Buy&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Create Business Account
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
