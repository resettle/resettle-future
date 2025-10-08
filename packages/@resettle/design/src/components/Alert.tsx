import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../utils/cn'

const alertVariants = tv({
  base: 'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive:
        'border-destructive/50 text-destructive dark:text-destructive-foreground/80 dark:border-destructive dark:bg-destructive/50 [&>svg]:text-current',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type AlertProps = React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants>

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

type AlertTitleProps = React.ComponentProps<'div'>

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

type AlertDescriptionProps = React.ComponentProps<'div'>

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertDescriptionProps,
  type AlertProps,
  type AlertTitleProps,
}
