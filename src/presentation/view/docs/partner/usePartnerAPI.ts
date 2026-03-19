'use client';

import { useState } from 'react';

export function usePartnerAPI() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const headers = [
    { name: 'X-PK-Key', value: 'your_api_key', desc: 'Your partner API key' },
    { name: 'X-PK-Signature', value: 'hmac_signature', desc: 'HMAC-SHA256 signature of the payload' },
    { name: 'X-PK-Timestamp', value: 'unix_timestamp', desc: 'Current Unix timestamp in seconds' },
    { name: 'Content-Type', value: 'application/json', desc: 'Must be application/json' }
  ];

  const requestSchema = [
    { field: 'amount', type: 'string', required: true, desc: 'Amount in smallest unit (e.g., "100000000" for 100 USDC)' },
    { field: 'currency', type: 'string', required: true, desc: 'Token symbol (USDC, USDT, DAI)' },
    { field: 'dest_chain', type: 'string', required: true, desc: 'CAIP-2 chain ID (eip155:8453)' },
    { field: 'metadata.order_id', type: 'string', required: false, desc: 'Your internal order ID' },
  ];

  const webhookSchema = [
    { field: 'id', type: 'string', desc: 'Unique webhook event ID' },
    { field: 'type', type: 'string', desc: 'Event type (payment.completed, payment.failed)' },
    { field: 'data', type: 'object', desc: 'Detailed payment data object' },
  ];

  return {
    copiedCode,
    handleCopy,
    headers,
    requestSchema,
    webhookSchema
  };
}
