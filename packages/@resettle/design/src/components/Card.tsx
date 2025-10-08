import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '../utils/cn'

type CardProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function Card({ className, asChild, ...props }: CardProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground rounded-xl border shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

type CardHeaderProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  const Comp = props.asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-5', className)}
      {...props}
    />
  )
}

type CardTitleProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function CardTitle({ className, asChild, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card-title"
      className={cn('leading-none font-medium tracking-tight', className)}
      {...props}
    />
  )
}

type CardDescriptionProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  const Comp = props.asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

type CardContentProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function CardContent({ className, ...props }: CardContentProps) {
  const Comp = props.asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card-content"
      className={cn('p-5 pt-0', className)}
      {...props}
    />
  )
}

type CardFooterProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function CardFooter({ className, ...props }: CardFooterProps) {
  const Comp = props.asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="card-footer"
      className={cn('flex items-center p-5 pt-0', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardContentProps,
  type CardDescriptionProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardProps,
  type CardTitleProps,
}
