'use client'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { AutoSizer, List } from 'react-virtualized'
import { tv, type VariantProps } from 'tailwind-variants'

import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { cn } from '../utils/cn'
import { Input } from './Input'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

const LIST_MAX_HEIGHT = 300
const MIN_ROW_COUNT_FOR_VIRTUALIZATION = 50

const selectVariants = tv({
  base: 'inline-flex cursor-pointer items-center justify-start gap-2 rounded-md text-sm whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  variants: {
    variant: {
      default:
        'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
    },
    size: {
      default: 'h-9 px-3',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-lg px-4',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type SelectOption<T> = {
  key: string
  value: T
  label: string
  keywords?: string[]
  disabled?: boolean
}

type SelectProps<T> = VariantProps<typeof selectVariants> & {
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
  options: SelectOption<T>[]
  value?: T | null | undefined
  onChange: (value: T) => void
  renderOption?: (option: SelectOption<T>) => React.ReactNode
  renderSelectValue?: (
    selectedOption: SelectOption<T> | null | undefined,
  ) => React.ReactNode
}

function Select<T>({
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
  value,
  onChange,
  renderOption = option => option.label,
  renderSelectValue = selectedOption => selectedOption?.label || placeholder,
  ...props
}: SelectProps<T>) {
  const selectedOption = options.find(option => option.value === value)

  const [open, setOpen] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const selectedItemRef = React.useRef<HTMLDivElement>(null)

  const debouncedKeyword = useDebouncedValue(keyword, 300)

  const handleSelect = (optionValue: T) => {
    onChange(optionValue)
    setOpen(false)
    setKeyword('')
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
    option: SelectOption<T>,
    style?: React.CSSProperties,
  ) => {
    const isSelected = value === option.value

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
        <span className="lining-nums">{renderOption(option)}</span>
        {isSelected && <CheckIcon className="size-4" />}
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
              'overflow-hidden text-ellipsis lining-nums',
              !selectedOption && 'opacity-50',
            )}
          >
            {renderSelectValue(selectedOption)}
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
                    scrollToIndex={filteredOptions.findIndex(
                      option => value === option.value,
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

export { Select, selectVariants, type SelectOption, type SelectProps }
