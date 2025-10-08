'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { cn } from '../utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  alwaysShowTooltip?: boolean
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  alwaysShowTooltip = false,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null)

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onPointerDown={e => {
        const thumb = (e.target as HTMLElement).closest('[role="slider"]')

        if (thumb) {
          const index = Array.from(thumb.parentElement?.children || [])
            .filter(el => el.getAttribute('role') === 'slider')
            .indexOf(thumb)

          setDraggingIndex(index)
        }
      }}
      onPointerUp={() => setDraggingIndex(null)}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <Tooltip
          key={index}
          open={
            alwaysShowTooltip || (draggingIndex === index ? true : undefined)
          }
        >
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              className="border-input bg-background ring-ring/20 block size-4 shrink-0 cursor-pointer rounded-full border shadow transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
            />
          </TooltipTrigger>
          <TooltipContent>{_values[index]}</TooltipContent>
        </Tooltip>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider, type SliderProps }
