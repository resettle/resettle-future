'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  useDialog,
  type DialogProps,
} from './Dialog'
import { Spinner } from './Spinner'
import { VisuallyHidden } from './VisuallyHidden'

interface LoadingDialogProps extends DialogProps {
  message?: string
}

function LoadingDialog(props: LoadingDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        closable={false}
        className="flex max-w-[calc(min(100%-var(--spacing)*4,var(--container-sm)))] flex-col items-center gap-4"
      >
        <VisuallyHidden asChild>
          <DialogTitle>Loading Dialog</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{props.message}</DialogDescription>
        </VisuallyHidden>
        <Spinner className="size-6" />
        <div>{props.message ?? 'Loading...'}</div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * A hook that returns a function to show a loading dialog.
 *
 * @returns A function to show a loading dialog.
 */
const useLoadingDialog = () => {
  const { showDialog } = useDialog()

  /**
   * A function to show a loading dialog.
   *
   * @param props - The props to pass to the loading dialog.
   * @returns A function to close the loading dialog.
   */
  const showLoadingDialog = (props: { message?: string }) => {
    return showDialog(LoadingDialog, {
      props,
      preventClose: true,
    })
  }

  /**
   * A function to handle a loading dialog.
   *
   * @param cb - The callback to execute.
   * @param props - The props to pass to the loading dialog.
   * @returns The result of the callback.
   */
  const handleLoadingDialog = async <T,>(
    cb: () => Promise<T>,
    props: { message?: string },
  ) => {
    const closeLoading = showLoadingDialog(props)

    try {
      return await cb()
    } finally {
      closeLoading()
    }
  }

  return {
    showLoadingDialog,
    handleLoadingDialog,
  }
}

export { LoadingDialog, useLoadingDialog, type LoadingDialogProps }
