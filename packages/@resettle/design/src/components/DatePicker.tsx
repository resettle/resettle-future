import * as React from 'react'

import { cn } from '../utils/cn'
import { Select } from './Select'

type DatePickerMode = 'year' | 'year-month' | 'year-month-day'

type DatePickerProps = Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  locale?: string
  mode?: DatePickerMode
  minYear?: number
  maxYear?: number
  className?: string
  disabled?: boolean
  value?: Date | string | null | undefined
  onChange?: (date: Date) => void
}

function DatePicker({
  locale = 'en',
  mode = 'year-month-day',
  minYear = new Date().getFullYear() - 100,
  maxYear = new Date().getFullYear() + 20,
  className = '',
  disabled = false,
  value,
  onChange,
  ...props
}: DatePickerProps) {
  const normalizeDate = React.useCallback(
    (date: Date): Date => {
      const normalizedDate = new Date(date)

      if (mode === 'year') {
        // For year mode, always set to January 1st
        normalizedDate.setMonth(0, 1)
      } else if (mode === 'year-month') {
        // For year-month mode, always set day to 1
        normalizedDate.setDate(1)
      }

      return normalizedDate
    },
    [mode],
  )

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    value === null || value === undefined
      ? null
      : normalizeDate(new Date(value)),
  )

  React.useEffect(() => {
    if (value) {
      setSelectedDate(normalizeDate(new Date(value)))
    } else {
      setSelectedDate(null)
    }
  }, [value, mode, normalizeDate])

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  )

  const localizedMonths = React.useMemo(() => {
    const months = []
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })

    for (let i = 0; i < 12; i++) {
      const date = new Date(2000, i, 1)

      months.push({
        value: i,
        label: formatter.format(date),
      })
    }

    return months
  }, [locale])

  const localizedPlaceholders = React.useMemo(() => {
    try {
      const placeholderDate = new Date('2000-01-01')

      const yearText =
        new Intl.DateTimeFormat(locale, { year: 'numeric' })
          .formatToParts(placeholderDate)
          .find(part => part.type === 'literal')?.value || 'Year'

      const monthText =
        new Intl.DateTimeFormat(locale, { month: 'numeric' })
          .formatToParts(placeholderDate)
          .find(part => part.type === 'literal')?.value || 'Month'

      const dayText =
        new Intl.DateTimeFormat(locale, { day: 'numeric' })
          .formatToParts(placeholderDate)
          .find(part => part.type === 'literal')?.value || 'Day'

      return {
        year: yearText,
        month: monthText,
        day: dayText,
      }
    } catch {
      return {
        year: 'Year',
        month: 'Month',
        day: 'Day',
      }
    }
  }, [locale])

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  const days = Array.from(
    {
      length: getDaysInMonth(
        selectedDate?.getFullYear() || new Date().getFullYear(),
        selectedDate?.getMonth() || 0,
      ),
    },
    (_, i) => i + 1,
  )

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10)

    // For year mode, always set to January 1st
    if (mode === 'year') {
      const newDate = new Date(newYear, 0, 1)
      setSelectedDate(newDate)
      onChange?.(newDate)
      return
    }

    const newDate = new Date(selectedDate || new Date(newYear, 0, 1))
    newDate.setFullYear(newYear)

    // For year-month mode, always set day to 1
    if (mode === 'year-month') {
      newDate.setDate(1)
    } else {
      // Check if the day is valid in the new month/year (e.g., Feb 29 in non-leap years)
      const daysInMonth = getDaysInMonth(newYear, newDate.getMonth())

      if (newDate.getDate() > daysInMonth) {
        newDate.setDate(daysInMonth)
      }
    }

    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value, 10)

    // If no date is selected, create a new one with the selected month
    const newDate = new Date(
      selectedDate || new Date(new Date().getFullYear(), newMonth, 1),
    )

    newDate.setMonth(newMonth)

    // For year-month mode, always set day to 1
    if (mode === 'year-month') {
      newDate.setDate(1)
    } else {
      // Check if the day is valid in the new month (e.g., March 31 -> Feb 28)
      const daysInMonth = getDaysInMonth(newDate.getFullYear(), newMonth)

      if (newDate.getDate() > daysInMonth) {
        newDate.setDate(daysInMonth)
      }
    }

    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const handleDayChange = (value: string) => {
    const newDay = parseInt(value, 10)

    // If no date is selected, create a new one with the selected day
    const newDate = new Date(
      selectedDate || new Date(new Date().getFullYear(), 0, newDay),
    )

    newDate.setDate(newDay)

    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className={cn('flex gap-2', className)} {...props}>
      <Select
        className="w-24"
        placeholder={localizedPlaceholders.year}
        options={years.map(year => ({
          key: `year-${year}`,
          value: year.toString(),
          label: year.toString(),
        }))}
        value={selectedDate?.getFullYear().toString()}
        onChange={handleYearChange}
        disabled={disabled}
      />

      {(mode === 'year-month' || mode === 'year-month-day') && (
        <Select
          className="w-32"
          placeholder={localizedPlaceholders.month}
          options={localizedMonths.map(month => ({
            key: `month-${month.value}`,
            value: month.value.toString(),
            label: month.label,
          }))}
          value={selectedDate?.getMonth().toString()}
          onChange={handleMonthChange}
          disabled={disabled}
        />
      )}

      {mode === 'year-month-day' && (
        <Select
          className="w-24"
          placeholder={localizedPlaceholders.day}
          options={days.map(day => ({
            key: `day-${day}`,
            value: day.toString(),
            label: day.toString(),
          }))}
          value={selectedDate?.getDate().toString()}
          onChange={handleDayChange}
          disabled={disabled}
        />
      )}
    </div>
  )
}

export { DatePicker, type DatePickerMode, type DatePickerProps }
