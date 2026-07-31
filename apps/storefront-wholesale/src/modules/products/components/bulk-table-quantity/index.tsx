import { MinusMini, PlusMini } from "@medusajs/icons"
import { IconButton, Input } from "@medusajs/ui"
import { useEffect, useState } from "react"

type BulkTableQuantityProps = {
  variantId: string
  bundleSize?: number
  onChange: (variantId: string, quantity: number) => void
}

const BulkTableQuantity = ({
  variantId,
  bundleSize = 1,
  onChange,
}: BulkTableQuantityProps) => {
  const [quantity, setQuantity] = useState("0")
  const [shiftPressed, setShiftPressed] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value) || 0

    // Ensure quantity is a multiple of bundle size
    if (bundleSize > 1) {
      newQuantity = Math.floor(newQuantity / bundleSize) * bundleSize
    }

    setQuantity(newQuantity.toString())
    onChange(variantId, newQuantity)
  }

  const handleAdd = () => {
    const currentQty = Number(quantity)
    const increment = shiftPressed ? bundleSize * 10 : bundleSize
    const newQty = Math.max(currentQty + increment, 0)

    setQuantity(newQty.toString())
    onChange(variantId, newQty)
  }

  const handleSubtract = () => {
    const currentQty = Number(quantity)
    const decrement = shiftPressed ? bundleSize * 10 : bundleSize
    const newQty = Math.max(currentQty - decrement, 0)

    setQuantity(newQty.toString())
    onChange(variantId, newQty)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      handleAdd()
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      handleSubtract()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShiftPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShiftPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div className="flex flex-row justify-center items-center gap-1 sm:gap-2 w-full max-w-[120px]">
      <IconButton
        onClick={() => handleSubtract()}
        className="rounded-full hover:bg-neutral-200 transition-colors w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
        variant="transparent"
        size="small"
      >
        <MinusMini className="w-3 h-3" />
      </IconButton>
      <Input
        value={quantity}
        onChange={(e) => handleChange(e)}
        onKeyDown={handleKeyDown}
        type="number"
        className="max-w-10 sm:max-w-12 h-7 sm:h-8 text-center text-xs sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-neutral-200 focus:border-neutral-400"
        min="0"
        step={bundleSize}
        placeholder="0"
      />
      <IconButton
        onClick={() => handleAdd()}
        className="rounded-full hover:bg-neutral-200 transition-colors w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
        variant="transparent"
        size="small"
      >
        <PlusMini className="w-3 h-3" />
      </IconButton>
    </div>
  )
}

export default BulkTableQuantity
