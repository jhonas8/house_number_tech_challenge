import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  onDismiss: (id: string) => void
}

const toastVariants = {
  default: "bg-white border border-gray-200",
  destructive: "border-red-200 bg-red-50 text-red-900",
  success: "border-green-500 bg-green-50 text-green-900"
}

export function Toast({ id, title, description, variant = 'default', onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        toastVariants[variant]
      )}
    >
      <div className="grid gap-1">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onDismiss(id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
} 