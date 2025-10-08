import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../utils/cn'

const inputVariants = tv({
  base: 'border-input placeholder:text-primary/40 focus-visible:ring-ring file:text-foreground flex h-9 w-full overflow-hidden border text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    size: {
      default: 'h-9 rounded-md px-3',
      sm: 'h-8 rounded-md px-3',
      lg: 'h-10 rounded-lg px-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

function Input({ className, size, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, type InputProps }
