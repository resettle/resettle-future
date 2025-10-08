'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as React from 'react'

import { cn } from '../utils/cn'
import { buttonVariants } from './Button'
import { usePortal } from './Portal'

type AlertDialogProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Root
> & {
  __resultType?: unknown
  onClose?: (result: unknown | null) => void
}

function AlertDialog({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

type AlertDialogTriggerProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Trigger
>

function AlertDialogTrigger({ ...props }: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

type AlertDialogPortalProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Portal
>

function AlertDialogPortal({ ...props }: AlertDialogPortalProps) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

type AlertDialogOverlayProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Overlay
>

function AlertDialogOverlay({ className, ...props }: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
        className,
      )}
      {...props}
    />
  )
}

type AlertDialogContentProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Content
>

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

type AlertDialogHeaderProps = React.ComponentProps<'div'>

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

type AlertDialogFooterProps = React.ComponentProps<'div'>

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

type AlertDialogTitleProps = React.ComponentProps<'div'>

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

type AlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Description
>

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

type AlertDialogActionProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Action
>

function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

type AlertDialogCancelProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Cancel
>

function AlertDialogCancel({ className, ...props }: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  )
}

/**
 * A hook that returns a function to open an alert dialog.
 *
 * @returns A function to open an alert dialog.
 */
const useAlertDialog = () => {
  const { createNode } = usePortal()

  /**
   * A function to open an alert dialog.
   *
   * @param Component - The component to open.
   * @param options - The options to pass to the alert dialog.
   * @param options.props - The props to pass to the alert dialog.
   * @param options.preventClose - Whether to prevent the alert dialog from being closed.
   * @param options.onClose - The callback to call when the alert dialog is closed.
   * @returns A function to close the alert dialog.
   */
  return <P extends AlertDialogProps, T = NonNullable<P['__resultType']>>(
    Component: React.ComponentType<P>,
    options: {
      props?: Omit<P, 'closeResultType' | 'open' | 'onOpenChange' | 'onClose'>
      preventClose?: boolean
      onClose?: (result: T | null) => void
    } = {},
  ) => {
    type ControllerRef = {
      close: () => Promise<void>
    }

    type ControllerProps = {
      onClose?: (result: T | null) => void
    }

    const Controller = React.forwardRef<ControllerRef, ControllerProps>(
      ({ onClose }, ref) => {
        const [open, setOpen] = React.useState(true)

        React.useImperativeHandle(ref, () => {
          return {
            close() {
              setOpen(false)

              return new Promise<void>(resolve => {
                setTimeout(() => resolve(onClose?.(null)), 300)
              })
            },
          }
        })

        return (
          <Component
            open={open}
            onOpenChange={newOpen => {
              if (!newOpen && options.preventClose) {
                return
              }

              setOpen(newOpen)

              if (!newOpen) {
                onClose?.(null)
              }
            }}
            onClose={result => {
              if (options.preventClose) {
                return
              }

              onClose?.(result as T)
            }}
            {...(options.props as P)}
          />
        )
      },
    )

    const ref = React.createRef<ControllerRef>()

    const dispose = createNode(
      <Controller
        ref={ref}
        onClose={result => {
          ref.current?.close().then(dispose)
          options.onClose?.(result)
        }}
      />,
    )

    return async () => ref.current!.close()
  }
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  useAlertDialog,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
  type AlertDialogContentProps,
  type AlertDialogDescriptionProps,
  type AlertDialogFooterProps,
  type AlertDialogHeaderProps,
  type AlertDialogOverlayProps,
  type AlertDialogPortalProps,
  type AlertDialogProps,
  type AlertDialogTitleProps,
  type AlertDialogTriggerProps,
}
