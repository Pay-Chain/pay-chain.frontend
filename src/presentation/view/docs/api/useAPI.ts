'use client';

import { useState } from 'react';

export function useAPI() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(id);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const endpoints = [
    {
      category: 'Authentication',
      items: [
        { method: 'POST', path: '/api/v1/auth/register', description: 'Register a new user account', auth: false },
        { method: 'POST', path: '/api/v1/auth/login', description: 'Login with email and password', auth: false },
        { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh access token', auth: true },
      ],
    },
    {
      category: 'Payments',
      items: [
        { method: 'POST', path: '/api/v1/payments', description: 'Create a new payment', auth: true },
        { method: 'GET', path: '/api/v1/payments/:id', description: 'Get payment details', auth: true },
        { method: 'GET', path: '/api/v1/payments', description: 'List all payments', auth: true },
      ],
    },
    {
      category: 'Payment Requests',
      items: [
        { method: 'POST', path: '/api/v1/payment-requests', description: 'Create a payment request', auth: true },
        { method: 'GET', path: '/api/v1/payment-requests/:id', description: 'Get payment request details', auth: true },
        { method: 'GET', path: '/api/v1/payment-requests', description: 'List payment requests', auth: true },
      ],
    },
  ];

  const getMethodVariant = (method: string): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (method) {
      case 'GET': return 'secondary';
      case 'POST': return 'success';
      case 'PUT': return 'warning';
      case 'DELETE': return 'destructive';
      default: return 'default';
    }
  };

  return {
    endpoints,
    copiedEndpoint,
    handleCopy,
    getMethodVariant
  };
}
