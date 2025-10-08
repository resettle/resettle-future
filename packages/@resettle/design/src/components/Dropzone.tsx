'use client'

import * as React from 'react'

import { cn } from '../utils/cn'

type DropzoneProps = Omit<
  React.ComponentProps<'div'>,
  'onClick' | 'onDragOver' | 'onDrop'
> & {
  disabled?: boolean
  accept?: string
  multiple?: boolean
  onChangeFiles?: (files: File[]) => void
}

function Dropzone({
  className,
  accept,
  disabled = false,
  multiple = false,
  onChangeFiles,
  ...props
}: DropzoneProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    handleFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (files) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    const allowedFiles = [...files].filter(file => {
      if (!accept) return true

      return accept
        .split(',')
        .map(type => type.trim())
        .some(type => {
          // Handle wildcards like "image/*"
          if (type.endsWith('/*')) {
            const mainType = type.split('/')[0]
            return file.type.startsWith(mainType + '/')
          }
          return file.type === type
        })
    })

    onChangeFiles?.(allowedFiles)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={cn(
        'text-muted-foreground bg-secondary flex h-32 flex-col items-center justify-center rounded-lg border px-6 text-center text-sm shadow-sm transition-colors',
        disabled ? 'cursor-auto' : 'hover:bg-secondary/80 cursor-pointer',
        className,
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      {...props}
    >
      <span className="font-medium">
        {disabled
          ? multiple
            ? 'You selected some files'
            : 'You selected a file'
          : multiple
            ? `Drag 'n' drop some files here, or click to select files`
            : `Drag 'n' drop a file here, or click to select a file`}
      </span>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileInputChange}
      />
    </div>
  )
}

export { Dropzone, type DropzoneProps }
