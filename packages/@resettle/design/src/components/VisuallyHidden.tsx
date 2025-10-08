'use client'

import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden'

type VisuallyHiddenProps = React.ComponentProps<
  typeof VisuallyHiddenPrimitive.Root
>

const VisuallyHidden = VisuallyHiddenPrimitive.Root

export { VisuallyHidden, type VisuallyHiddenProps }
