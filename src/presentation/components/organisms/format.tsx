'use client'

import { memo, useMemo } from 'react'

interface FormatCurrencyProps {
  amount: string | number
  currency?: string
  locale?: string
}

export const FormatCurrency = memo(function FormatCurrency({
  amount,
  currency = 'USD',
  locale = 'en-US',
}: FormatCurrencyProps) {
  const formatted = useMemo(() => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numAmount)) {
      return '-'
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount)
  }, [amount, currency, locale])

  return <span>{formatted}</span>
})

interface FormatDateProps {
  date: string | Date
  format?: 'short' | 'long' | 'relative'
  locale?: string
}

export const FormatDate = memo(function FormatDate({
  date,
  format = 'short',
  locale = 'en-US',
}: FormatDateProps) {
  const formatted = useMemo(() => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return '-'
    }

    if (format === 'relative') {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
        Math.floor((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        'day'
      )
    }

    const options: Intl.DateTimeFormatOptions = format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }

    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  }, [date, format, locale])

  return <span>{formatted}</span>
})

interface TruncateProps {
  children: string
  length?: number
  endLength?: number
}

export const Truncate = memo(function Truncate({
  children,
  length = 20,
  endLength = 0,
}: TruncateProps) {
  const truncated = useMemo(() => {
    if (!children || children.length <= length) {
      return children
    }

    if (endLength > 0) {
      return `${children.slice(0, length)}...${children.slice(-endLength)}`
    }

    return `${children.slice(0, length)}...`
  }, [children, length, endLength])

  return <span title={children}>{truncated}</span>
})

interface TruncateAddressProps {
  address: string
  startLength?: number
  endLength?: number
}

export const TruncateAddress = memo(function TruncateAddress({
  address,
  startLength = 6,
  endLength = 4,
}: TruncateAddressProps) {
  const truncated = useMemo(() => {
    if (!address || address.length <= startLength + endLength) {
      return address
    }

    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
  }, [address, startLength, endLength])

  return <span title={address} className="font-mono">{truncated}</span>
})
