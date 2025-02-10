import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'default'
          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        className
      )}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button }
