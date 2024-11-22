// components/ui/loader.tsx
import { Loader2 } from "lucide-react"

export function Loader({ size = "default", className = "" }: { size?: "default" | "sm" | "lg", className?: string }) {
  const sizeClasses = {
    default: "w-8 h-8",
    sm: "w-4 h-4",
    lg: "w-12 h-12"
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  )
}