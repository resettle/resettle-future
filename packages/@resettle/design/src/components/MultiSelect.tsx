'use client'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { AutoSizer, List } from 'react-virtualized'
import type { VariantProps } from 'tailwind-variants'

import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { cn } from '../utils/cn'
import { Input } from './Input'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { selectVariants } from './Select'

const LIST_MAX_HEIGHT = 300
const MIN_ROW_COUNT_FOR_VIRTUALIZATION = 50

type MultiSelectOption<T> = {
  key: string
  value: T
  label: string
  keywords?: string[]
  disabled?: boolean
}

type MultiSelectProps<T> = VariantProps<typeof selectVariants> & {
  className?: string
  popoverClassName?: string
  style?: React.CSSProperties
  disabled?: boolean
  placeholder?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  rowHeight?: number
  searchable?: boolean
  searchPlaceholder?: string
  options: MultiSelectOption<T>[]
  value?: T[] | null | undefined
  onChange: (value: T[]) => void
  renderOption?: (option: MultiSelectOption<T>) => React.ReactNode
  renderSelectValue?: (
    selectedOptions: MultiSelectOption<T>[],
  ) => React.ReactNode
}

function MultiSelect<T>({
  className,
  popoverClassName,
  variant,
  size,
  placeholder = 'Select an option',
  align = 'start',
  side = 'bottom',
  rowHeight = 36,
  searchable = false,
  searchPlaceholder = 'Search...',
  options,
  value = [],
  onChange,
  renderOption = option => option.label,
  renderSelectValue = selectedOptions =>
    selectedOptions.length > 0
      ? selectedOptions.map(option => option.label).join(', ')
      : placeholder,
  ...props
}: MultiSelectProps<T>) {
  const selectedValues = value || []
  const selectedOptions = options.filter(option =>
    selectedValues.includes(option.value),
  )

  const [open, setOpen] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const selectedItemRef = React.useRef<HTMLDivElement>(null)

  const debouncedKeyword = useDebouncedValue(keyword, 300)

  const handleSelect = (optionValue: T) => {
    const newValue = [...selectedValues]
    const index = newValue.indexOf(optionValue)

    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(optionValue)
    }

    onChange(newValue)
  }

  const filteredOptions = React.useMemo(() => {
    if (!debouncedKeyword) {
      return options
    }

    const keyword = debouncedKeyword.toLowerCase()

    return options.filter(
      option =>
        option.label.toLowerCase().includes(keyword) ||
        option.keywords?.some(kw => kw.toLowerCase().includes(keyword)),
    )
  }, [options, debouncedKeyword])

  const renderOptionRow = (
    option: MultiSelectOption<T>,
    style?: React.CSSProperties,
  ) => {
    const isSelected = selectedValues.includes(option.value)

    return (
      <div
        key={option.key}
        style={{ height: rowHeight, ...style }}
        ref={isSelected ? selectedItemRef : null}
        className={cn(
          'hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between px-3 text-sm',
          isSelected && 'bg-accent text-accent-foreground',
          option.disabled && 'pointer-events-none opacity-50',
        )}
        onClick={() => handleSelect(option.value)}
      >
        <span>{renderOption(option)}</span>
        {isSelected && <CheckIcon className="h-4 w-4" />}
      </div>
    )
  }

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (selectedItemRef.current && scrollContainerRef.current) {
          selectedItemRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          })
        }
      })
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            selectVariants({ variant, size }),
            'w-full min-w-0 justify-between',
            className,
          )}
          onClick={() => setOpen(!open)}
          {...props}
        >
          <span
            className={cn(
              'overflow-hidden text-ellipsis',
              selectedOptions.length === 0 && 'opacity-50',
            )}
          >
            {renderSelectValue(selectedOptions)}
          </span>
          <ChevronDownIcon className="opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[var(--radix-popover-trigger-width)] p-0',
          popoverClassName,
        )}
        align={align}
        side={side}
      >
        {searchable && (
          <div className="border-b p-2">
            <Input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder={searchPlaceholder}
              size="sm"
              className="w-full"
            />
          </div>
        )}
        <div
          ref={scrollContainerRef}
          className="overflow-auto"
          style={{ maxHeight: LIST_MAX_HEIGHT }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.length > MIN_ROW_COUNT_FOR_VIRTUALIZATION ? (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    width={width}
                    height={LIST_MAX_HEIGHT}
                    rowCount={filteredOptions.length}
                    rowHeight={rowHeight}
                    scrollToIndex={filteredOptions.findIndex(option =>
                      selectedValues.includes(option.value),
                    )}
                    rowRenderer={({ index, style }) =>
                      renderOptionRow(filteredOptions[index], style)
                    }
                    overscanRowCount={5}
                  />
                )}
              </AutoSizer>
            ) : (
              <>{filteredOptions.map(option => renderOptionRow(option))}</>
            )
          ) : (
            <div
              className="text-muted-foreground flex items-center justify-center px-3 text-center text-sm"
              style={{ height: rowHeight }}
            >
              No results found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect, type MultiSelectOption, type MultiSelectProps }
