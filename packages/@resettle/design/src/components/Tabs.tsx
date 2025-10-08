'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { useIsMobile } from '../hooks/useIsMobile'
import { cn } from '../utils/cn'
import { Select, type SelectOption } from './Select'

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>

function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1',
        className,
      )}
      {...props}
    />
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex-1 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0',
        className,
      )}
      {...props}
    />
  )
}

type ResponsiveTabsListProps = TabsListProps & {
  children: React.ReactElement<TabsTriggerProps>[]
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  renderLabel?: (child: React.ReactElement<TabsTriggerProps>) => string
}

function ResponsiveTabsList({
  className,
  children,
  placeholder = 'Select a tab',
  value,
  onValueChange,
  renderLabel,
  ...props
}: ResponsiveTabsListProps) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <TabsList className={className} {...props}>
        {children}
      </TabsList>
    )
  }

  // Extract tab options from children
  const options: SelectOption<string>[] = React.Children.map(
    children,
    child => {
      if (React.isValidElement<TabsTriggerProps>(child)) {
        const childValue = child.props.value

        // Use renderLabel prop if provided, otherwise extract text content
        let label: string

        if (renderLabel) {
          label = renderLabel(child)
        } else {
          // Extract text content from complex children
          const extractTextContent = (children: React.ReactNode): string => {
            console.log('children', children)
            if (typeof children === 'string') return children
            if (typeof children === 'number') return children.toString()
            if (React.isValidElement(children)) {
              if (
                children.props &&
                typeof children.props === 'object' &&
                'children' in children.props
              ) {
                return extractTextContent(
                  children.props.children as React.ReactNode,
                )
              }
            }
            if (Array.isArray(children)) {
              return children.map(extractTextContent).join(' ')
            }
            return childValue
          }

          label = extractTextContent(child.props.children)
        }

        return {
          key: childValue,
          value: childValue,
          label: label,
        }
      }
      return null
    },
  ).filter(Boolean) as SelectOption<string>[]

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <Select
        options={options}
        value={value}
        onChange={handleValueChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

export {
  ResponsiveTabsList,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type ResponsiveTabsListProps,
  type TabsContentProps,
  type TabsListProps,
  type TabsProps,
  type TabsTriggerProps,
}
