import { Slot } from '@radix-ui/react-slot'

import { cn } from '../utils/cn'

type SkeletonProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

function Skeleton({ asChild, className, ...props }: SkeletonProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="skeleton"
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton, type SkeletonProps }
