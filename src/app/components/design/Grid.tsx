import { cn } from '@/lib/utils'
import type { ElementType, ReactNode, Ref, ComponentPropsWithoutRef } from 'react'

/**
 * Props for Row and Column components.
 */
type FlexProps<T extends ElementType = 'div'> = {
  as?: T
  children?: ReactNode
  className?: string
  ref?: Ref<HTMLDivElement>
} & ComponentPropsWithoutRef<T>

/**
 * Row Component using Tailwind Flexbox.
 */
export const Row = <T extends ElementType = 'div'>({ as, children, className, ...props }: FlexProps<T>) => {
  const Component = (as || 'div') as ElementType

  return (
    <Component className={cn('flex flex-row flex-nowrap', className)} {...props}>
      {children}
    </Component>
  )
}

/**
 * Column Component using Tailwind Flexbox.
 */
export const Column = <T extends ElementType = 'div'>({ as, children, className, ...props }: FlexProps<T>) => {
  const Component = (as || 'div') as ElementType

  return (
    <Component className={cn('flex flex-col flex-nowrap', className)} {...props}>
      {children}
    </Component>
  )
}
