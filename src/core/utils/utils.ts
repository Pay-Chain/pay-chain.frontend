import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(parseFloat(amount))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function truncateAddress(address: string, length: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export function truncateString(str: string, length: number): string {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadFile(content: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
