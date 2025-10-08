'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '../utils/cn'
import { usePortal } from './Portal'

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  __resultType?: unknown
  onClose?: (result: unknown | null) => void
}

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>

function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40',
        className,
      )}
      {...props}
    />
  )
}

type DialogContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  closable?: boolean
  closeOnInteractOutside?: boolean
}

function DialogContent({
  className,
  children,
  closable = true,
  closeOnInteractOutside = false,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay className="overflow-y-auto">
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 grid w-full gap-4 rounded-lg border p-6 shadow-lg duration-200',
            'sm:fixed sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]',
            'relative mx-auto my-2 max-w-[calc(min(100%-var(--spacing)*4,var(--container-lg)))] md:w-full',
            className,
          )}
          onInteractOutside={e => {
            if (!closeOnInteractOutside) {
              e.preventDefault()
            }
          }}
          onOpenAutoFocus={e => {
            e.preventDefault()
          }}
          {...props}
        >
          {children}
          {closable && (
            <DialogPrimitive.Close className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
}

type DialogHeaderProps = React.ComponentProps<'div'>

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  )
}

type DialogFooterProps = React.ComponentProps<'div'>

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'text-lg leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

type DialogDescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/**
 * A hook that returns a function to open a dialog.
 *
 * @returns A function to open a dialog.
 */
const useDialog = () => {
  const { createNode } = usePortal()

  /**
   * A function to open a dialog.
   *
   * @param Component - The component to open.
   * @param options - The options to pass to the dialog.
   * @param options.props - The props to pass to the dialog.
   * @param options.preventClose - Whether to prevent the dialog from being closed.
   * @param options.onClose - The callback to call when the dialog is closed.
   * @returns A function to close the dialog.
   */
  const showDialog = <
    P extends DialogProps,
    T = NonNullable<P['__resultType']>,
  >(
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

    return () => ref.current!.close()
  }

  return { showDialog }
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  useDialog,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogProps,
  type DialogTitleProps,
  type DialogTriggerProps,
}
