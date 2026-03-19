'use client'

import { memo, useMemo } from 'react'
import { Badge } from '../atoms'

interface StatusBadgeProps {
  status: string
  variant?: 'auto' | 'payment' | 'merchant' | 'webhook'
}

export const StatusBadge = memo(function StatusBadge({ 
  status, 
  variant = 'auto' 
}: StatusBadgeProps) {
  const badgeVariant = useMemo(() => {
    if (variant === 'payment') {
      return getPaymentStatusVariant(status)
    }
    if (variant === 'merchant') {
      return getMerchantStatusVariant(status)
    }
    if (variant === 'webhook') {
      return getWebhookStatusVariant(status)
    }
    // Auto-detect based on status value
    return getAutoStatusVariant(status)
  }, [status, variant])

  return (
    <Badge variant={badgeVariant}>
      {status}
    </Badge>
  )
})

function getPaymentStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'SUCCESS':
      return 'success'
    case 'PENDING':
    case 'PROCESSING':
      return 'warning'
    case 'FAILED':
    case 'ERROR':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getMerchantStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'active':
      return 'success'
    case 'pending':
    case 'review':
      return 'warning'
    case 'rejected':
    case 'suspended':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getWebhookStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success'
    case 'pending':
    case 'retrying':
      return 'warning'
    case 'failed':
    case 'dropped':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getAutoStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  const upperStatus = status.toUpperCase()
  
  // Success patterns
  if (['COMPLETED', 'SUCCESS', 'APPROVED', 'ACTIVE', 'DELIVERED'].includes(upperStatus)) {
    return 'success'
  }
  
  // Warning patterns
  if (['PENDING', 'PROCESSING', 'REVIEW', 'RETRYING'].includes(upperStatus)) {
    return 'warning'
  }
  
  // Error patterns
  if (['FAILED', 'ERROR', 'REJECTED', 'SUSPENDED', 'DROPPED'].includes(upperStatus)) {
    return 'destructive'
  }
  
  return 'secondary'
}

// Export convenience components
export const PaymentStatusBadge = memo((props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="payment" />
))

export const MerchantStatusBadge = memo((props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="merchant" />
))

export const WebhookStatusBadge = memo((props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="webhook" />
))
